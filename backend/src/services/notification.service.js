import Notification from "../models/notification.models.js";
import initEmitter from "../config/socket/socket.emitter.js";

class NotificationService {
    async createNotification(payload) {
        const { receiverId, docModel, notificationType, title, message, data } =
            payload;

        // console.log("PAYLOAD: ", payload)

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

    async getAllNotification(filters = {}) {
        filters.isRead = false;

        const allNotifications = await Notification.find(filters);

        return allNotifications;
    }

    async markNotificationAsRead(notificationId) {
        const notification = await Notification.findByIdAndUpdate(notificationId, { isRead: true }, { new: true });
        return notification;
    }

    async sendChatUpdateNotification(chatReq, notification, isVendor = false) {
        const io = await initEmitter();
        io.nsp = "/notification";

        console.log("notification:" + notification.receiverId)

        io.of("/notification")
            .to("notification:" + notification.receiverId)
            .emit("chat-request-update", notification);
    }

    async sendOrderUpdateNotification(order, notification) {
        console.log(order);
        const io = await initEmitter();

        io.nsp = "/notification"

        io.of("/notification")
            .to("notification:" + (order.user._id || order.user))
            // .to("notification:" + order.user._id)
            .emit("order-place-update", notification);

    }

    async sendOrderDeliveryUpdateNotification(orders) {
        const io = await initEmitter();
        io.nsp = "/order"

        orders.forEach((order) =>
            io
                .of("/order")
                .to("order:" + order._id)
                .emit("delivery-update", order),
        );
    }
}

export default new NotificationService();
