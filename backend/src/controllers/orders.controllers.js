import { asyncHandler } from "../utils/asyncHandler.js";
import razorpayService from "../services/razorpay.service.js";
import ApiResponse from "../utils/api-response.js";
import productService from "../services/product.service.js";
import orderService from "../services/order.service.js";
import ApiError from "../utils/api-error.js";
import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils.js";

import mongoose from "mongoose";
import addressService from "../services/address.service.js";
import { inngest } from "../inngest/index.js";
import { createInvoice } from "../utils/helpers.js";
import imageKitService from "../services/imageKit.service.js";

const getAllVendorOrders = asyncHandler(async (req, res) => {
    const { _id } = req.user.vendorId;
    const { page } = req.params;
    let matchStage = {};

    matchStage.vendor = new mongoose.Types.ObjectId(_id);

    const allOrders = await orderService.getVendorOrders(matchStage, page);

    res.json(new ApiResponse(200, allOrders, "Orders fetched successfully"));
});

const createOrder = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { products, prefills, notes, shippingAddressId } = req.body;

    console.log(req.body);

    const isUserAddress = await addressService.getAddressById(
        shippingAddressId,
        _id,
    );

    if (!isUserAddress) throw new ApiError(404, "Shipping address not found");

    const allProducts = await productService.getAll({
        slug: {
            $in: Object.keys(products),
            // $in: products.map((el) => el.slug),
        },
        "approval.status": {
            $eq: "accepted",
        },
    });

    console.log(allProducts)

    if (allProducts?.totalCount !== Object.keys(products).length)
        throw new ApiError(404, "Some products not found");

    let totalAmount = allProducts.data.reduce((acc, curr) => {
        return acc + (curr.price * products[curr.slug])
    }, 0);

    console.log(totalAmount);

    const payload = {
        amount: totalAmount * 100,
        currency: "INR",
    };

    console.log(payload);

    const order = await razorpayService.createOrder(payload);

    console.log(order);

    const dbPayload = {
        user: _id,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency || "INR",
        shippingAddress: shippingAddressId,
        name: "Marketly",
        description: "Pay Now And Get The Products",
        products,
        prefills,
        notes,
    };

    const dbOrder = await orderService.createOrder(dbPayload);
    // console.log(dbOrder)

    res.json(new ApiResponse(201, {dbOrder, rzpId: process.env.RAZORPAY_KEY_ID}, "Order created successfully"));
});

const getOrderByOrderId = asyncHandler(async (req, res) => {
    const { orderId } = req.params;

    const filters = {};
    const matchStage = {};

    if (req.user.currentRole === "user") {
        filters.user = new mongoose.Types.ObjectId(req.user._id);
    } else if (req.user.currentRole === "vendor") {
        matchStage.vendor = new mongoose.Types.ObjectId(req.user.vendorId._id);
    }

    const order = await orderService.getOrderById(orderId, filters, matchStage);
    
    if (!order) throw new ApiError(404, "Order not found");

    res.json(new ApiResponse(200, order, "Order fetched successfully"));
});

const getAllOrders = asyncHandler(async (req, res) => {
    const { page } = req.params;
    let matchStage = {};

    console.log(req.user)

    if (req.user.currentRole === "user") matchStage.user = new mongoose.Types.ObjectId(req.user._id);
    // if (req.user.currentRole === "vendor")
    //     matchStage.vendor = new mongoose.Types.ObjectId(req.user.vendorId._id);

    const allOrders = await orderService.getAll(matchStage, page);

    res.json(new ApiResponse(200, allOrders, "Orders fetched successfully"));
});

const updateOrderDeliveryStatus = asyncHandler(async (req, res, next) => {
    const { _id } = req.user.vendorId;
    const { sellerOrderId, deliveryStatus } = req.body;

    const order = await orderService.updateOrder(
        { _id: sellerOrderId, vendor: _id },
        { deliveryStatus },
    );

    if (!order) throw new ApiError(404, "Order not found");

   try {
     await inngest
        .send({
            name: "notification/send-order-delivery-update",
            data: { orders: [order] },
        })
   } catch {}

    res.json(new ApiResponse(200, order, "Order updated successfully"));
});

const verifyOrderPayment = asyncHandler(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
        req.body;

    const verifyPayment = await razorpayService.verify({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
    });

    if (!verifyPayment) throw new ApiError(400, "Invalid signature");

    res.json(new ApiResponse(200, {}, "Signature verified successfully"));
});

const webhook = asyncHandler(async (req, res, next) => {
    const webhookBody = req.body;
    const webhookSignature = req.headers["x-razorpay-signature"];

    const { payload, event } = webhookBody;

    try {
        validateWebhookSignature(
            JSON.stringify(webhookBody),
            webhookSignature,
            process.env.RAZORPAY_WEBHOOK_SECRET,
        );

        if (event === "payment.captured" || event === "payment.failed") {
            const {
                payment: { entity },
            } = payload;

            const updateData = {
                paymentId: entity.id,
            };

            if (event === "payment.captured") {
                updateData.status = "paid";
            } else if (event === "payment.failed") updateData.status = "failed";

            const order = await orderService.updateParentOrder(
                { orderId: entity.order_id },
                updateData,
            );

            if (event !== "payment.failed")  await inngest
                .send({
                    name: "order/order-fulfillment",
                    data: {
                        orderDocId: order._id,
                        products: order.products,
                        status: order.status,
                        user: order.user,
                    },
                })
                .catch((err) => {});
           
        } else if (event === "refund.processed") {
            const {
                refund: { entity },
            } = payload;

            await inngest.send({
                name: "refund/mark-refund",
                data: {
                    refundDocId: entity.notes.refundId,
                    refundId: entity.id,
                    amount: entity.amount,
                },
            });
        }

        res.json(new ApiResponse(200, {}));
    } catch (e) {
        console.log(e);
        throw new ApiError(400, "Invalid signature");
    }
});

const generateTestInvoice = asyncHandler(async (req, res) => {
    const sampleData = {
        baseOrder: {
            orderId: "ORD_" + Math.random().toString(36).substr(2, 9).toUpperCase(),
            paymentId: "PAY_" + Math.random().toString(36).substr(2, 9).toUpperCase(),
            amount: 9298,
            createdAt: new Date(),
            shippingAddress: {
                fullname: "John Smith",
                addressLine1: "42 Galaxy Towers, Sector 12",
                city: "Bangalore",
                state: "Karnataka",
                country: "India",
            }
        },
        sellerOrders: [
            {
                vendor: { storeName: "Eco-Friendly Co." },
                products: [
                    {
                        product: { name: "Activated Charcoal Face Wash", price: 299 },
                        quantity: 1
                    }
                ]
            },
            {
                vendor: { storeName: "Modern Home Decor" },
                products: [
                    {
                        product: { name: "Handcrafted Oak Study Desk", price: 8999 },
                        quantity: 1
                    }
                ]
            },
            {
                vendor: { storeName: "Eco-Friendly Co." },
                products: [
                    {
                        product: { name: "Activated Charcoal Face Wash", price: 299 },
                        quantity: 1
                    }
                ]
            },
            {
                vendor: { storeName: "Modern Home Decor" },
                products: [
                    {
                        product: { name: "Handcrafted Oak Study Desk", price: 8999 },
                        quantity: 1
                    }
                ]
            },
            {
                vendor: { storeName: "Modern Home Decor" },
                products: [
                    {
                        product: { name: "Handcrafted Oak Study Desk", price: 8999 },
                        quantity: 1
                    }
                ]
            },
            {
                vendor: { storeName: "Modern Home Decor" },
                products: [
                    {
                        product: { name: "Handcrafted Oak Study Desk", price: 8999 },
                        quantity: 1
                    }
                ]
            },
        ]
    };

    const pdfBuffer = await createInvoice(sampleData);
    
    // We pass the buffer directly to imageKitService.upload
    const uploadResult = await imageKitService.upload(pdfBuffer);

    res.json(new ApiResponse(200, {
        url: uploadResult.url,
        fileId: uploadResult.fileId,
        dataUsed: sampleData
    }, "Test invoice generated and uploaded successfully"));
});

export {
    createOrder,
    getOrderByOrderId,
    verifyOrderPayment,
    getAllOrders,
    webhook,
    updateOrderDeliveryStatus,
    getAllVendorOrders,
    generateTestInvoice
};
