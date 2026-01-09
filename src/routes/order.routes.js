const express = require("express");
const { Router } = require("express");
const {
    createOrder,
    verifyOrderPayment,
    webhook,
    updateOrderDeliveryStatus,
    getOrderByOrderId,
    segregateSellerOrders,
    getAllOrders,
    getInvoice,
} = require("../controllers/orders.controllers");
const {
    verifyPaymentValidations,
    updateOrderDeliveryStatusValidations,
    createOrderValidations,
} = require("../validations/order.validations");
const { validate } = require("../middlewares/validate.middlewares");
const {
    isAuthenticated,
    authorise,
} = require("../middlewares/auth.middlewares");
const router = Router();

router.get("/gg", getInvoice);
router.get(
    "/:orderId",
    isAuthenticated,
    authorise("user", "vendor", "super-admin"),
    getOrderByOrderId,
);

router.get(
    "/",
    isAuthenticated,
    authorise("user", "vendor", "super-admin"),
    getAllOrders,
);

router.post(
    "/create-order",
    isAuthenticated,
    authorise("user"),
    validate(createOrderValidations),
    createOrder,
);

router.post(
    "/payment-verify",
    isAuthenticated,
    authorise("user"),
    validate(verifyPaymentValidations),
    verifyOrderPayment,
);

router.post(
    "/webhook",
    express.raw({ type: "application/json" }),
    webhook,
    segregateSellerOrders,
);

router.patch(
    "/delivery-status",
    isAuthenticated,
    authorise("vendor"),
    validate(updateOrderDeliveryStatusValidations),
    updateOrderDeliveryStatus,
);



module.exports = router;
