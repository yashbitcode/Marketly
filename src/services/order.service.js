const Order = require("../models/order.models");
const Product = require("../models/product.models");
const SellerOrder = require("../models/sellerOrder.models");
const { getIO } = require("../socket/socket.manager");
const util = require("node:util");
const mongoose = require("mongoose");

class OrderService {
    constructor() {
        this.io = getIO();
    }

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
        });

        await order.save();

        return order;
    }

    async getAll(matchStage = {}) {
        const allOrders = await SellerOrder.aggregate([
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
                },
            },
        ]);

        return allOrders;
    }

    async getOrderById(matchStage = {}) {
        const order = await SellerOrder.aggregate([
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
                            $lookup: {
                                from: "addresses",
                                localField: "shippingAddress",
                                foreignField: "_id",
                                as: "shippingAddress",
                            },
                        },
                        {
                            $unwind: "$shippingAddress",
                        },
                    ],
                },
            },
            {
                $unwind: "$order",
            },
            {
                $unwind: "$sellerOrders",
            },
            {
                $lookup: {
                    from: "vendors",
                    localField: "sellerOrders.vendor",
                    foreignField: "_id",
                    as: "sellerOrders.vendor",
                },
            },
            {
                $unwind: "$sellerOrders.vendor",
            },
            {
                $unwind: "$sellerOrders.products",
            },
            {
                $lookup: {
                    from: "products",
                    localField: "sellerOrders.products.product",
                    foreignField: "_id",
                    as: "sellerOrders.products.product",
                },
            },
            {
                $unwind: "$sellerOrders.products.product",
            },

            {
                $lookup: {
                    from: "sub-categories",
                    localField: "sellerOrders.products.product.category",
                    foreignField: "_id",
                    as: "sellerOrders.products.product.category",
                },
            },
            {
                $unwind: "$sellerOrders.products.product.category",
            },
            {
                $lookup: {
                    from: "parent-categories",
                    localField:
                        "sellerOrders.products.product.category.parentCategory",
                    foreignField: "_id",
                    as: "sellerOrders.products.product.category.parentCategory",
                },
            },
            {
                $unwind: "$sellerOrders.products.product.category.parentCategory",
            },
            {
                $group: {
                    _id: {
                        orderId: "$_id",
                        sellerId: "$sellerOrders._id",
                    },
                    order: { $first: "$order" },
                    products: {
                        $push: "$sellerOrders.products",
                    },
                    sellerOrders: { $first: "$sellerOrders" },
                },
            },
            {
                $addFields: {
                    "sellerOrders.products": "$products",
                },
            },
            {
                $group: {
                    _id: "$_id.orderId",
                    order: { $first: "$order" },
                    sellerOrders: { $push: "$sellerOrders" },
                },
            },
        ]);

        return order;
    }

    async createSellerOrders(orderDocId, user, products) {
        const productSlugs = Array.from(products.keys());

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
                },
            },
        ]);

        const orders = groupedProducts.map((el) => ({
            vendor: el._id,
            user,
            orderDocId,
            products: el.products,
        }));

        const sellerOrders = await SellerOrder.insertMany(orders);

        // console.log(util.inspect(sellerOrders, { depth: null }));

        return sellerOrders;
    }

    async updateOrder(filters = {}, payload = {}) {
        const order = await SellerOrder.findOneAndUpdate(filters, payload, {
            new: true,
            runValidators: true,
        });

        return order;
    }

    async sendOrderDeliveryUpdate(orders) {
        orders.forEach((order) =>
            this.io
                .of("/order")
                .to("order:" + order._id)
                .emit("delivery-update", order),
        );
    }
}

module.exports = new OrderService();
