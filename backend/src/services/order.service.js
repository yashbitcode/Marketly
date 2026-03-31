import mongoose from "mongoose";
import Order from "../models/order.models.js";
import Product from "../models/product.models.js";
import SellerOrder from "../models/sellerOrder.models.js";
import { getPaginationBasePipeline } from "../utils/helpers.js";
import vendorPayoutService from "./vendorPayout.service.js";
import { GENERAL_USER_FIELDS } from "../../../shared/constants.js";

class OrderService {
    async createOrder(payload) {
        const {
            orderId,
            name,
            products,
            description,
            amount,
            currency,
            prefills,
            notes,
            user,
            shippingAddress,
        } = payload;

        const order = new Order({
            orderId,
            name,
            products,
            description,
            amount,
            currency,
            prefills,
            notes,
            user,
            shippingAddress,
        });

        await order.save();

        return order;
    }

    async getAll(matchStage = {}, page = 1) {
        const basePagination = getPaginationBasePipeline(+page);

        console.log(matchStage);

        
        const [allOrders] = await Order.aggregate([
            {
                $match: matchStage,
            },
            ...basePagination,
        ]);

        return allOrders;
    }

    async getVendorOrders(matchStage = {}, page = 1) {
        const basePagination = getPaginationBasePipeline(+page);

        console.log(matchStage);

        
        const [allOrders] = await SellerOrder.aggregate([
            {
                $match: matchStage,
            },
            {
                $group: {
                    _id: "$orderDocId",
                    sellerOrders: {
                        $push: "$$ROOT",
                    },
                },
            },
            {
                $lookup: {
                    from: "orders",
                    localField: "_id",
                    foreignField: "_id",
                    as: "order",
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                user: 1,
                                orderId: 1,
                                name: 1,
                                description: 1,
                                prefills: 1
                            }
                        }
                    ]
                },
            },
            {
                $addFields: {
                    order: { $arrayElemAt: ["$order", 0] },
                },
            },
            ...basePagination,
        ]);


        return allOrders;
    }

    async getOrderById(baseOrderId, filters = {}, matchStage = {}) {
        let baseOrder = await Order.findOne({
            ...filters,
            _id: baseOrderId,
        }).populate("shippingAddress");

        if (!baseOrder) return;

        if (baseOrder.status === "created") {
            const baseDate = new Date(baseOrder.createdAt).getTime();

            const diff =
                (baseDate - (baseDate - (1000 * 60 * 15))) /
                (1000 * 60);

                console.log(diff);
                
            if (diff >= 15)
                baseOrder = await Order.findByIdAndUpdate(
                    { _id: baseOrderId },
                    { status: "failed" },
                    { new: true },
                );
        }

        if(baseOrder.status === "failed") return { baseOrder};

        const sellerOrders = await SellerOrder.aggregate([
            {
                $match: {
                    ...matchStage,
                    orderDocId: new mongoose.Types.ObjectId(baseOrderId),
                },
            },
            // {
            //     $group: {
            //         _id: "$orderDocId",
            //         sellerOrders: {
            //             $push: "$$ROOT",
            //         },
            //     },
            // },
            // {
            //     $lookup: {
            //         from: "orders",
            //         localField: "_id",
            //         foreignField: "_id",
            //         as: "order",
            //         pipeline: [
            //             {
            //                 $lookup: {
            //                     from: "addresses",
            //                     localField: "shippingAddress",
            //                     foreignField: "_id",
            //                     as: "shippingAddress",
            //                 },
            //             },
            //             {
            //                 $unwind: "$shippingAddress",
            //             },
            //         ],
            //     },
            // },
            // {
            //     $unwind: "$order",
            // },
            // {
            //     $unwind: "$sellerOrders",
            // },
            {
                $lookup: {
                    from: "vendors",
                    localField: "vendor",
                    foreignField: "_id",
                    as: "vendor",
                },
            },
            {
                $unwind: "$vendor",
            },
            {
                $unwind: "$products",
            },
            {
                $lookup: {
                    from: "products",
                    localField: "products.product",
                    foreignField: "_id",
                    as: "products.product",
                },
            },
            {
                $unwind: "$products.product",
            },

            {
                $lookup: {
                    from: "sub-categories",
                    localField: "products.product.category",
                    foreignField: "_id",
                    as: "products.product.category",
                },
            },
            {
                $unwind: "$products.product.category",
            },
            {
                $lookup: {
                    from: "parent-categories",
                    localField: "products.product.category.parentCategory",
                    foreignField: "_id",
                    as: "products.product.category.parentCategory",
                },
            },
            {
                $unwind: "$products.product.category.parentCategory",
            },
            {
                $group: {
                    _id: "$_id",
                    doc: { $first: "$$ROOT" },
                    products: {
                        $push: "$products",
                    },
                },
            },
            {
                $addFields: {
                    "doc.products": "$products",
                },
            },
            {
                $replaceRoot: {
                    newRoot: "$doc",
                },
            },
            // {
            //     $addFields: {
            //         "products": "$products",
            //     },
            // },
            // {
            //     $group: {
            //         _id: "$_id.orderId",
            //         order: { $first: "$order" },
            //         sellerOrders: { $push: "$sellerOrders" },
            //     },
            // },
        ]);

        return { baseOrder, sellerOrders };
    }

    async getBaseOrder(filters = {}) {
        const order = await Order.findOne(filters);

        return order;
    }

    async createSellerOrders(orderDocId, user, products) {
        const productSlugs = Object.keys(products);

        const groupedProducts = await Product.aggregate([
            {
                $match: {
                    slug: {
                        $in: productSlugs,
                    },
                },
            },
            {
                $group: {
                    _id: "$vendor",
                    products: {
                        $push: {
                            product: "$_id",
                            quantity: {
                                $getField: {
                                    field: "$slug",
                                    input: products,
                                },
                            },
                        },
                    },
                    totalAmount: {
                        $sum: {
                            $multiply: [
                                "$price",
                                {
                                    $getField: {
                                        field: "$slug",
                                        input: products,
                                    },
                                },
                            ],
                        },
                    },
                },
            },
        ]);

        let sellerOrdersPayload = [];
        let vendorPayoutsPayload = [];

        groupedProducts.forEach((el) => {
            const sellerOrderId = new mongoose.Types.ObjectId();

            sellerOrdersPayload.push({
                _id: sellerOrderId,
                vendor: el._id,
                user,
                orderDocId,
                products: el.products,
            });

            vendorPayoutsPayload.push({
                vendor: el._id,
                sellerOrder: sellerOrderId,
                amount: +el.totalAmount * 0.8,
                order: orderDocId,
            });
        });

        const sellerOrders = await SellerOrder.insertMany(sellerOrdersPayload);
        const vendorPayouts =
            await vendorPayoutService.createBulkVendorPayouts(
                vendorPayoutsPayload,
            );
        // console.log(util.inspect(sellerOrders, { depth: null }));

        return { sellerOrders, vendorPayouts };
    }

    async updateParentOrder(filters = {}, payload = {}) {
        const order = await Order.findOneAndUpdate(filters, payload, {
            new: true,
            runValidators: true,
        }).populate("user", GENERAL_USER_FIELDS);

        return order;
    }

    async updateOrder(filters = {}, payload = {}) {
        const order = await SellerOrder.findOneAndUpdate(filters, payload, {
            new: true,
            runValidators: true,
        });

        return order;
    }

    async doesSellerOrderExists(filters = {}) {
        const sellerOrder = await SellerOrder.exists(filters);

        return sellerOrder;
    }
}

export default new OrderService();
