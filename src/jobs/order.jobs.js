const orderService = require("../services/order.service");
const { orderPlacedInvoiceMailContent } = require("../utils/mail");
const { createInvoice } = require("../utils/helpers");
const imageKitService = require("../services/imageKit.service");
// const notificationQueue = require("../queues/notification.queue");

const orderJob = async (job) => {
    const { user, status, products, orderDocId } = job.data;

    if (status !== "paid") return;

    let order = await orderService.getOrderById({ orderDocId });
    const sellerOrder = await orderService.doesSellerOrderExists({
        orderDocId,
    });

    if (!sellerOrder)
        await orderService.createSellerOrders(orderDocId, user, products);

    if (!order.invoice) {
        const pdfBuffer = await createInvoice(order);

        const { fileId, name, url } = await imageKitService.upload(pdfBuffer);

        order = await orderService.updateParentOrder(
            { _id: order._id },
            {
                invoice: {
                    fileId,
                    filename: name,
                    url,
                    thumbnailUrl: url,
                },
            },
        );

        

        await emailQueue.add("send-email", emailData, {
            removeOnComplete: true,
            removeOnFail: true,
            attempts: 3,
        });
    }

    const notificationPayload = {
        receiverId: order.user.toString(),
        docModel: "users",
        notificationType: "ORDER_UPDATE",
        title: "Order Update",
        message:
            order.status === "paid"
                ? `Your Order Is Placed: ${order.orderId}`
                : `Your Order Placing Failed: ${order.orderId}`,
    };

    await notificationQueue.add(
        "order-placed",
        { notificationPayload, order },
        {
            removeOnComplete: true,
            removeOnFail: true,
            attempts: 3,
        },
    );
};

module.exports = {
    orderJob,
};
