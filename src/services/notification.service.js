const Notification = require("../models/notification.models");
const { getIO } = require("../socket/socket.manager");

class NotificationService {
    constructor() {
        this.io = getIO();
    }

    async createNotification(payload) {
        const { receiverId, docModel, notificationType, title, message, data } =
            payload;

        const notification = new Notification({
            receiverId,
            docModel,
            notificationType,
            title,
            message,
            data,
        });

        await notification.save();

        return notification;
    }

    async sendChatUpdateNotification(chatReq, notification) {
        io.of("/notification")
            .to("notification:" + chatReq.user)
            .emit("chat-request-update", notification);
    }
}

module.exports = new NotificationService();
