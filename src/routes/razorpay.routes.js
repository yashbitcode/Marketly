const express = require("express");
const { Router } = require("express");
const { createOrder, verifyOrderPayment, webhook } = require("../controllers/razorpay.controllers");
const router = Router();

router.post(
    "/create-order",
    createOrder
);

router.post("/webhook", express.raw({ type: "application/json" }), webhook);

router.post("/payment-verify", verifyOrderPayment);

module.exports = router;
