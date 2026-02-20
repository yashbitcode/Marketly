import mongoose from "mongoose";
import User from "./user.models.js";
import { mediaSchema } from "../utils/baseSchemas.js";
import { REFUND_APPLICATION_STATUS } from "../utils/constants.js";
// import Order from "./order.models.js";

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
            message: "`{VALUE}` is not valid value",
        },
        default: "under-process",
    },
    refundId: String,
});

const OrderRefundApplication = mongoose.model(
    "order-refund-applications",
    OrderRefundApplicationSchema,
);

export default OrderRefundApplication;
