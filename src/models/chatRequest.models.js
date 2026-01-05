const mongoose = require("mongoose");
const User = require("./user.models");
const Vendor = require("./vendor.models");
const { PRODUCT_APPROVAL_STATUS: APPROVAL_STATUS } = require("../utils/constants");

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
    chatId: String
});

const ChatRequest = mongoose.model("chat-requests", ChatRequestSchema);

module.exports = ChatRequest;