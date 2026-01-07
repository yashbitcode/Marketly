const { asyncHandler } = require("../utils/asyncHandler");
const razorpayService = require("../services/razorpay.service");
const ApiResponse = require("../utils/api-response");
const productService = require("../services/product.service");
const orderService = require("../services/order.service");
const ApiError = require("../utils/api-error");
const {
    validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");

const createOrder = asyncHandler(async (req, res) => {
    // const { _id } = req.user;
    const { products, prefills, notes } = req.body;

    const allProducts = await productService.getAll({
        slug: {
            $in: products.map((el) => el.slug),
        },
    });

    if (allProducts.length !== products.length)
        throw new ApiError(404, "Some products not found");

    let totalAmount = 0;

    allProducts.forEach(
        (el, idx) => (totalAmount += el.price * products[idx].quantity),
    );

    const payload = {
        amount: totalAmount * 100,
        currency: "INR",
    };

    const order = await razorpayService.createOrder(payload);

    const dbPayload = {
        // user: _id,
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

const webhook = asyncHandler(async (req, res) => {
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

        if (event === "payment.captured") updateData.status = "paid";
        else if (event === "payment.failed") updateData.status = "failed";

        await orderService.updateOrder(
            { orderId: entity.order_id },
            updateData,
        );

        res.json(new ApiResponse(200))
    } catch {
        throw new ApiError(400, "Invalid signature");
    }
});

module.exports = {
    createOrder,
    verifyOrderPayment,
    webhook,
};
