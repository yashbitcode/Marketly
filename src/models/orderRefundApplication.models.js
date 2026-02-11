const mongoose = require("mongoose");
const User = require("./user.models");
const { mediaSchema } = require("../utils/baseSchemas");
const { REFUND_APPLICATION_STATUS } = require("../utils/constants");
// const Order = require("./order.models");

const OrderRefundApplicationSchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "orders",
        required: [true, "Order ID is required"],
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: [true, "User ID is required"],
    },
    reason: {
        type: String,
        required: [true, "Reason is required"],
        min: [10, "Minimum length should be 10"],
    },
    attachments: {
        type: [new mongoose.Schema(mediaSchema, { _id: false })],
        default: undefined,
    },
    status: {
        type: String,
        enum: {
            values: REFUND_APPLICATION_STATUS,
            message: "`{VALUE}` is not valid value"
        },
        default: "under-process"
    },
    refundId: String
});

const OrderRefundApplication = mongoose.model("order-refund-applications", OrderRefundApplicationSchema);

module.exports = OrderRefundApplication;