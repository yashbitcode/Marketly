import Notification from "../models/notification.models.js";
import initEmitter from "../config/socket/socket.emitter.js";

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

    async sendChatUpdateNotification(chatReq, notification) {
        const io = await initEmitter();

        io.of("/notification")
            .to("notification:" + chatReq.user)
            .emit("chat-request-update", notification);
    }

    async sendOrderUpdateNotification(order, notification) {
        const io = await initEmitter();

        io.of("/notification")
            .to("notification:" + order.user)
            .emit("order-place-update", notification);
    }

    async sendOrderDeliveryUpdateNotification(orders) {
        const io = await initEmitter();

        orders.forEach((order) =>
            io
                .of("/order")
                .to("order:" + order._id)
                .emit("delivery-update", order),
        );
    }
}

export default new NotificationService();
