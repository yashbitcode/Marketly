const { Router } = require("express");
const { createOrder } = require("../controllers/razorpay.controllers");
const router = Router();

router.post(
    "/create-order",
    createOrder
);

module.exports = router;
