import express from "express";
import { Router } from "express";
import {
    createOrder,
    verifyOrderPayment,
    webhook,
    updateOrderDeliveryStatus,
    getOrderByOrderId,
    getAllOrders,
    gg,
} from "../controllers/orders.controllers.js";
import {
    verifyPaymentValidations,
    updateOrderDeliveryStatusValidations,
    createOrderValidations,
} from "../../../shared/validations/order.validations.js";
import { validate } from "../middlewares/validate.middlewares.js";
import { isAuthenticated, authorise } from "../middlewares/auth.middlewares.js";
const router = Router();

router.get("/gg", gg);
router.get(
    "/specific/:orderId",
    isAuthenticated,
    authorise("user", "vendor", "super-admin"),
    getOrderByOrderId,
);

router.get(
    "/:page",
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

router.post("/webhook", express.raw({ type: "application/json" }), webhook);

router.patch(
    "/delivery-status",
    isAuthenticated,
    authorise("vendor"),
    validate(updateOrderDeliveryStatusValidations),
    updateOrderDeliveryStatus,
);

export default router;
