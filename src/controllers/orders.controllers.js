const { asyncHandler } = require("../utils/asyncHandler");
const razorpayService = require("../services/razorpay.service");
const ApiResponse = require("../utils/api-response");
const productService = require("../services/product.service");
const orderService = require("../services/order.service");
const ApiError = require("../utils/api-error");
const {
    validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");
const notificationService = require("../services/notification.service");
const { validateSchema } = require("../utils/helpers");
const { addNotificationValidations } = require("../validations/notification.validations");

const createOrder = asyncHandler(async (req, res) => {
    // const { _id } = req.user;
    const { products, prefills, notes } = req.body;

    console.log(req.body)

    const allProducts = await productService.getAll({
        slug: {
            $in: Object.keys(products),
            // $in: products.map((el) => el.slug),
        },
    });

    console.log(allProducts)

    if (allProducts.length !== Object.keys(products).length)
        throw new ApiError(404, "Some products not found");

    let totalAmount = 0;

    allProducts.forEach(
        (el) => (totalAmount += el.price * products[el.slug]),
    );

    const payload = {
        amount: totalAmount * 100,
        currency: "INR",
    };

    console.log(payload);

    const order = await razorpayService.createOrder(payload);

    console.log(order);

    const dbPayload = {
        // user: _id,
        user: "695260f3fd88aeed840374de",
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        name: "Marketly",
        description: "Pay Now And Get The Products",
        products,
        prefills,
        notes,
    };

    const dbOrder = await orderService.createOrder(dbPayload);

    res.json(new ApiResponse(201, dbOrder, "Order created successfully"));
});

const getOrderByOrderId = asyncHandler(async (req, res) => {
    const {orderId} = req.params;

    const order = await orderService.getOrder({orderId});

    if(!order) throw new ApiError(404, "Order not found");

    res.json(new ApiResponse(200, order, "Order fetched successfully"));
});

const updateOrderDeliveryStatus = asyncHandler(async (req, res) => {
    const {orderId, deliveryStatus} = req.body;
    
    const order = await orderService.updateOrder({orderId}, {deliveryStatus});

    if(!order) throw new ApiError(404, "Order not found");

    await orderService.sendOrderDeliveryUpdate(order);

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

const segregateSellerOrders = asyncHandler(async (req, res) => {
    const {user, status, products, orderDocId} = req.order
    console.log(req.order);

    if(status === "paid") await orderService.createSellerOrders(orderDocId, user, products);

    res.json(new ApiResponse(200));
})

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
            updateData.deliveryStatus = "placed";
        }
        else if (event === "payment.failed") updateData.status = "failed";

        const order = await orderService.updateOrder(
            { orderId: entity.order_id },
            updateData,
        );

        const notificationPayload = validateSchema(addNotificationValidations, {
            receiverId: order.user.toString(),
            // receiverId: order.user || "695260f3fd88aeed840374de",
            docModel: "users",
            notificationType: "ORDER_UPDATE",
            title: "Order Update",
            message: order.status === "paid" ? `Your Order Is Placed: ${order.orderId}` : `Your Order Placing Failed: ${order.orderId}`,
        });

        const notification = await notificationService.createNotification(notificationPayload)

        await notificationService.sendOrderUpdateNotification(notification);

        if(event === "payment.failed") throw new ApiError();

        req.order = {
            orderDocId: order._id,
            products: order.products,
            status: order.status,
            user: order.user
        };

        next();
    } catch(e) {
        console.log(e)
        throw new ApiError(400, "Invalid signature");
    }
});

module.exports = {
    createOrder,
    getOrderByOrderId,
    verifyOrderPayment,
    webhook,
    updateOrderDeliveryStatus,
    segregateSellerOrders
};
