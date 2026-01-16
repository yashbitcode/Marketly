const { asyncHandler } = require("../utils/asyncHandler");
const razorpayService = require("../services/razorpay.service");
const ApiResponse = require("../utils/api-response");
const productService = require("../services/product.service");
const orderService = require("../services/order.service");
const ApiError = require("../utils/api-error");
const {
    validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");

const mongoose = require("mongoose");
const addressService = require("../services/address.service");
const orderQueue = require("../queues/order.queue");
const notificationQueue = require("../queues/notification.queue");

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
            $in: products.map((el) => el.slug),
        },
        "approval.status": {
            $eq: "accepted",
        },
    });

    if (allProducts.length !== Object.keys(products).length)
        throw new ApiError(404, "Some products not found");

    let totalAmount = 0;

    allProducts.forEach((el) => (totalAmount += el.price * products[el.slug]));

    const payload = {
        amount: totalAmount * 100,
        currency: "INR",
    };

    console.log(payload);

    const order = await razorpayService.createOrder(payload);

    console.log(order);

    const dbPayload = {
        user: _id,
        // user: "695260f3fd88aeed840374de",
        orderId: order.id || "sassas",
        amount: order.amount || 1200,
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

    res.json(new ApiResponse(201, dbOrder, "Order created successfully"));
});

const getOrderByOrderId = asyncHandler(async (req, res) => {
    const { orderId } = req.params;

    const matchStage = {
        orderDocId: new mongoose.Types.ObjectId(orderId),
    };

    if (req.user.currentRole === "user") matchStage.user = req.user._id;
    if (req.user.currentRole === "vendor")
        matchStage.vendor = req.user.vendorId._id;

    const order = await orderService.getOrderById(matchStage);

    if (!order) throw new ApiError(404, "Order not found");

    res.json(new ApiResponse(200, order, "Order fetched successfully"));
});

const getAllOrders = asyncHandler(async (req, res) => {
    let matchStage = {};

    if (req.user.currentRole === "user") matchStage.user = req.user._id;
    if (req.user.currentRole === "vendor")
        matchStage.vendor = req.user.vendorId._id;

    const allOrders = await orderService.getAll(matchStage);

    res.json(new ApiResponse(200, allOrders, "Orders fetched successfully"));
});

const updateOrderDeliveryStatus = asyncHandler(async (req, res) => {
    const { _id } = req.user.vendorId;
    const { sellerOrderId, deliveryStatus } = req.body;

    const order = await orderService.updateOrder(
        { _id: sellerOrderId, vendor: _id },
        { deliveryStatus },
    );

    if (!order) throw new ApiError(404, "Order not found");

    await notificationQueue.add(
        "order-delivery-update",
        { orders: [order] },
        {
            removeOnComplete: true,
            removeOnFail: true,
            attempts: 3,
        },
    );

    res.json(new ApiResponse(200, order, "Order updated successfully"));
});

const gg = asyncHandler(async (req, res) => {
    const notificationPayload = {
        receiverId: "695260f3fd88aeed840374de",
        docModel: "users",
        notificationType: "CHAT_REQUEST_UPDATE",
        title: "Chat Request Update",
        message: `Your Recent Chat Request Is: accepted`,
    };

    await notificationQueue.add(
        "chat-update",
        {
            notificationPayload,
            chatReq: {
                _id: "695b6de3cb37696a4d45088d",
                user: "695260f3fd88aeed840374de",
                vendor: "695260f3fd88aeed840374dc",
                status: "pending",
            },
        },
        {
            removeOnComplete: true,
            removeOnFail: true,
        },
    );
    res.json({});
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

    const {
        payload: {
            payment: { entity },
        },
        event,
    } = webhookBody;

    try {
        validateWebhookSignature(
            JSON.stringify(webhookBody),
            webhookSignature,
            process.env.RAZORPAY_WEBHOOK_SECRET,
        );

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

        if (event === "payment.failed") throw new ApiError();

        await orderQueue.add(
            "order-fulfillment",
            {
                orderDocId: order._id,
                products: order.products,
                status: order.status,
                user: order.user,
            },
            { removeOnComplete: true, removeOnFail: true, attempts: 3 },
        );

        res.json(new ApiResponse(200, {}));
    } catch (e) {
        console.log(e);
        throw new ApiError(400, "Invalid signature");
    }
});

module.exports = {
    createOrder,
    getOrderByOrderId,
    verifyOrderPayment,
    getAllOrders,
    webhook,
    updateOrderDeliveryStatus,
    gg,
};
