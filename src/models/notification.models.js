const mongoose = require("mongoose");
const {
    MESSAGE_DOC_MODEL_TYPES: NOTIFICATION_DOC_MODEL_TYPES,
} = require("../utils/constants");

const NotificationSchema = new mongoose.Schema({
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "docModel",
        requrired: [true, "Receiver ID is required"],
    },
    docModel: {
        type: String,
        required: [true, "DocModel is required"],
        enum: {
            values: NOTIFICATION_DOC_MODEL_TYPES,
            message: "`{VALUE}` is not valid value",
        },
    },
    notificationType: {
        type: String,
        enum: {
            values: NOTIFICATION_DOC_MODEL_TYPES,
            message: "`{VALUE}` is not valid value",
        },
        default: "GENERAL_UPDATE"
    },
    title: {
        type: String,
        required: [true, "Title is required"]
    },
    message: {
        type: String,
        required: [true, "Message is required"]
    },
    isRead: {
        type: Boolean,
        default: false
    },
    data: {
        type: Map,
        of: String
    }
});

const Notification = mongoose.model("notifications", NotificationSchema);

module.exports = Notification;

/* 
- chat-req accepted
- order update 
- general  
*/
