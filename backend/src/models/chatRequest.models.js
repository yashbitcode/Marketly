import mongoose from "mongoose";
import User from "./user.models.js";
import Vendor from "./vendor.models.js";
import { CHAT_REQUEST_STATUS } from "shared/constants.js";

const ChatRequestSchema = new mongoose.Schema(
    {
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
                values: CHAT_REQUEST_STATUS,
                message: "`{VALUE}` is not valid value",
            },
            default: "pending",
        },
        chatId: String,
    },
    {
        timestamps: true,
    },
);

const ChatRequest = mongoose.model("chat-requests", ChatRequestSchema);

export default ChatRequest;
