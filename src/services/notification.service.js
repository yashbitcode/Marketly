const Notification = require("../models/notification.models");
const io = require("../socket/socket.emitter");

class NotificationService {
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

    sendChatUpdateNotification(chatReq, notification) {
        io.of("/notification")
            .to("notification:" + chatReq.user)
            .emit("chat-request-update", notification);
    }

    sendOrderUpdateNotification(order, notification) {
        io.of("/notification")
            .to("notification:" + order.user)
            .emit("order-place-update", notification);
    }

    sendOrderDeliveryUpdateNotification(orders) {
        orders.forEach((order) =>
            io
                .of("/order")
                .to("order:" + order._id)
                .emit("delivery-update", order),
        );
    }
}

module.exports = new NotificationService();
