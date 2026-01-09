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
const { validateSchema, createInvoice } = require("../utils/helpers");
const {
    addNotificationValidations,
} = require("../validations/notification.validations");
const mongoose = require("mongoose");
const addressService = require("../services/address.service");

const createOrder = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { products, prefills, notes, shippingAddressId } = req.body;

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

    console.log(allProducts);

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
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        shippingAddress: shippingAddressId,
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

    await orderService.sendOrderDeliveryUpdate([order]);

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
    const { user, status, products, orderDocId } = req.order;

    if (status === "paid") {
        const sellerOrders = await orderService.createSellerOrders(
            orderDocId,
            user,
            products,
        );

        await orderService.sendOrderDeliveryUpdate(sellerOrders);
    }

    res.json(new ApiResponse(200));
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
            updateData.deliveryStatus = "placed";
        } else if (event === "payment.failed") updateData.status = "failed";

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
            message:
                order.status === "paid"
                    ? `Your Order Is Placed: ${order.orderId}`
                    : `Your Order Placing Failed: ${order.orderId}`,
        });

        const notification = await notificationService.createNotification(
            notificationPayload,
        );

        await notificationService.sendOrderUpdateNotification(notification);

        if (event === "payment.failed") throw new ApiError();

        req.order = {
            orderDocId: order._id,
            products: order.products,
            status: order.status,
            user: order.user,
        };

        next();
    } catch (e) {
        console.log(e);
        throw new ApiError(400, "Invalid signature");
    }
});

const getInvoice = asyncHandler(async (req, res) => {
    createInvoice(
        {
            _id: "695f95d347b5bbf198e231bb",
            order: {
                _id: "695f95d347b5bbf198e231bb",
                user: "695260f3fd88aeed840374de",
                orderId: "order_S1MwNkIujxmZZ6",
                name: "Marketly",
                description: "Pay Now And Get The Products",
                amount: 4000,
                currency: "INR",
                prefills: {
                    name: "sasa",
                    email: "saijs@gmail.com",
                    phoneNumber: "+919876543210",
                },
                notes: [
                    {
                        description: "Best Course for SDE placements",
                    },
                ],
                products: {
                    "111-dFDWQe": 3,
                    "222-xXs3sf": 2,
                },
                status: "paid",
                createdAt: "2026-01-08T11:32:35.816Z",
                updatedAt: "2026-01-08T11:32:49.960Z",
                __v: 0,
                paymentId: "pay_S1MwbbYVkWmuvV",
                shippingAddress: {
                    _id: "694e920f26d68f0bcaf8f7bc",
                    userId: "695260f3fd88aeed840374de",
                    fullname: "mananan",
                    phoneNumber: "+919999999999",
                    addressLine1: "92100210921",
                    city: "sasa",
                    state: "sasa",
                    postalCode: "sa",
                    country: "0sa",
                    addressType: "other",
                    isDefault: true,
                    __v: 0,
                    addressLine2: "9210koksadsdssd",
                },
            },
            sellerOrders: [
                {
                    _id: "695f95e247b5bbf198e231c1",
                    vendor: {
                        _id: "6953cf49456f0bcb6a03432f",
                        vendorType: "individual",
                        avatar: "https://reu.com",
                        storeName: "sds",
                        fullname: "dsjds",
                        accountStatus: "active",
                        phoneNumber: "+919999999999",
                        metrics: {
                            avgCustomerRating: 0,
                            totalOrders: 0,
                            fulfilledOrders: 0,
                            rejectedOrders: 0,
                        },
                        createdAt: "2025-12-30T13:10:33.345Z",
                        updatedAt: "2025-12-30T13:10:33.345Z",
                        __v: 0,
                    },
                    user: "695260f3fd88aeed840374de",
                    orderDocId: "695f95d347b5bbf198e231bb",
                    products: [
                        {
                            product: {
                                _id: "69574b6719823146e1604c3e",
                                name: "111",
                                price: 10,
                                category: {
                                    _id: "69574c5cd2174e04728d32ff",
                                    name: "yashi",
                                    parentCategory: {
                                        _id: "69574de2d2174e04728d3309",
                                        name: "parent-yash",
                                        slug: "parent-yash-sa",
                                        createdAt: "2025-12-30T16:52:10.616Z",
                                        updatedAt: "2025-12-30T16:52:10.616Z",
                                        __v: 0,
                                    },
                                    slug: "yashi-saiusa",
                                    createdAt: "2026-01-01T09:40:47.416Z",
                                    updatedAt: "2026-01-01T09:40:47.416Z",
                                    __v: 0,
                                },
                                vendor: "6953cd93456f0bcb6a034329",
                                brandName: "111",
                                currency: "₹",
                                approval: {
                                    status: "pending",
                                },
                                description:
                                    "saijsiajsisiaijsajijsiasijasaijsijaajis",
                                pros: ["sa"],
                                cons: ["sasa", "sa"],
                                keyFeatures: ["sasa", "sa"],
                                images: ["sasaijsaij"],
                                stockQuantity: 0,
                                attributes: [
                                    {
                                        name: "dsij",
                                        dataType: "text",
                                        isVariant: false,
                                        value: "sa",
                                    },
                                ],
                                slug: "111-dFDWQe",
                                createdAt: "2026-01-02T04:36:55.293Z",
                                updatedAt: "2026-01-02T04:36:55.293Z",
                                __v: 0,
                            },
                            quantity: 3,
                        },
                    ],
                    deliveryStatus: "shipped",
                    __v: 0,
                    createdAt: "2026-01-08T11:32:50.142Z",
                    updatedAt: "2026-01-09T04:17:45.453Z",
                },
                {
                    _id: "695f95e247b5bbf198e231c2",
                    vendor: {
                        _id: "6953cf49456f0bcb6a03432f",
                        vendorType: "individual",
                        avatar: "https://reu.com",
                        storeName: "sds",
                        fullname: "dsjds",
                        accountStatus: "active",
                        phoneNumber: "+919999999999",
                        metrics: {
                            avgCustomerRating: 0,
                            totalOrders: 0,
                            fulfilledOrders: 0,
                            rejectedOrders: 0,
                        },
                        createdAt: "2025-12-30T13:10:33.345Z",
                        updatedAt: "2025-12-30T13:10:33.345Z",
                        __v: 0,
                    },
                    user: "695260f3fd88aeed840374de",
                    orderDocId: "695f95d347b5bbf198e231bb",
                    products: [
                        {
                            product: {
                                _id: "69574b6f19823146e1604c42",
                                name: "222",
                                price: 5,
                                category: {
                                    _id: "6956411f91f0d6e5eb6d6a11",
                                    name: "saui saiusa",
                                    parentCategory: {
                                        _id: "6954034a7abe99f7fe31267a",
                                        name: "asasa9 sa",
                                        base: 1,
                                        slug: "asasa9-sa",
                                        createdAt: "2025-12-30T16:52:26.026Z",
                                        updatedAt: "2025-12-30T16:52:26.026Z",
                                        __v: 0,
                                    },
                                    slug: "saui-saiusa",
                                    createdAt: "2026-01-01T09:40:47.416Z",
                                    updatedAt: "2026-01-01T09:40:47.416Z",
                                    __v: 0,
                                },
                                vendor: "6953cf49456f0bcb6a03432f",
                                brandName: "111",
                                currency: "₹",
                                approval: {
                                    status: "pending",
                                },
                                description:
                                    "saijsiajsisiaijsajijsiasijasaijsijaajis",
                                pros: ["sa"],
                                cons: ["sasa", "sa"],
                                keyFeatures: ["sasa", "sa"],
                                images: ["sasaijsaij"],
                                stockQuantity: 0,
                                attributes: [
                                    {
                                        name: "dsij",
                                        dataType: "text",
                                        isVariant: false,
                                        value: "sa",
                                    },
                                ],
                                slug: "222-xXs3sf",
                                createdAt: "2026-01-02T04:37:03.997Z",
                                updatedAt: "2026-01-02T04:37:03.997Z",
                                __v: 0,
                            },
                            quantity: 2,
                        },
                    ],
                    deliveryStatus: "placed",
                    __v: 0,
                    createdAt: "2026-01-08T11:32:50.143Z",
                    updatedAt: "2026-01-08T11:32:50.143Z",
                },
            ],
        },
        "invoice.pdf",
    );

    res.send();
});

module.exports = {
    createOrder,
    getOrderByOrderId,
    verifyOrderPayment,
    getAllOrders,
    webhook,
    updateOrderDeliveryStatus,
    segregateSellerOrders,
    getInvoice,
};
