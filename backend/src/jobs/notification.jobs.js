import notificationService from "../services/notification.service.js";

const sendChatUpdateJob = async (job) => {
    const { chatReq, notificationPayload } = job.data;

    const notification =
        await notificationService.createNotification(notificationPayload);

    await notificationService.sendChatUpdateNotification(chatReq, notification);
};

const sendOrderUpdateJob = async (job) => {
    const { notificationPayload, order } = job.data;

    const notification =
        await notificationService.createNotification(notificationPayload);

    await notificationService.sendOrderUpdateNotification(order, notification);
};

const sendOrdersDeliveryUpdateJob = async (job) => {
    const { orders } = job.data;

    await notificationService.sendOrderDeliveryUpdateNotification(orders);
};

export { sendChatUpdateJob, sendOrderUpdateJob, sendOrdersDeliveryUpdateJob };
