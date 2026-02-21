import mongoose from "mongoose";
import { MESSAGE_DOC_MODEL_TYPES } from "../../../shared/constants.js";
import { mediaSchema } from "../utils/baseSchemas.js";

const MessageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "docModel",
        required: [true, "Sender ID is required"],
    },
    docModel: {
        type: String,
        required: [true, "DocModel is required"],
        enum: {
            values: MESSAGE_DOC_MODEL_TYPES,
            message: "`{VALUE}` is not valid value",
        },
    },
    chatId: String,
    message: {
        type: String,
        required: [true, "Message is required"],
        min: [10, "Minimum length should be 10"],
    },
    attachments: {
        type: [new mongoose.Schema(mediaSchema, { _id: false })],
        default: undefined,
    },
});

const Message = mongoose.model("messages", MessageSchema);

export default Message;
