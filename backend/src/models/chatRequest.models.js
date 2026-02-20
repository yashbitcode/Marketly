import mongoose from "mongoose";
import User from "./user.models.js";
import Vendor from "./vendor.models.js";
import { PRODUCT_APPROVAL_STATUS as APPROVAL_STATUS } from "../utils/constants.js";

const ChatRequestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
    },
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Vendor,
    },
    status: {
        type: String,
        enum: {
            values: APPROVAL_STATUS,
            message: "`{VALUE}` is not valid value",
        },
        default: "pending",
    },
    chatId: String,
});

const ChatRequest = mongoose.model("chat-requests", ChatRequestSchema);

export default ChatRequest;
