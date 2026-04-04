import { Inngest } from "inngest";
import { sendMail, orderPlacedInvoiceMailContent } from "../utils/mail.js";
import orderService from "../services/order.service.js";
import imageKitService from "../services/imageKit.service.js";
import notificationService from "../services/notification.service.js";
import { createInvoice } from "../utils/helpers.js";
import orderRefundApplicationService from "../services/orderRefundApplication.service.js";
import mongoose from "mongoose";

const inngest = new Inngest({ id: "my-app" });

const handleMailing = inngest.createFunction(
    { id: "send-mail" },
    { event: "mail/send-mail" },
    async ({ event, step }) => {
        const emailOptions = event.data;

        const email = await step.run(
            "send-email",
            async () => await sendMail(emailOptions),
        );

        return email;
    },
);

const orderFulfillment = inngest.createFunction(
    { id: "order-fulfillment" },
    { event: "order/order-fulfillment" },
    async ({ event, step }) => {
        const { user, status, products, orderDocId } = event.data;

        if (status !== "paid") return;

        const sellerOrder = await step.run(
            "seller-order-exists",
            async () =>
                await orderService.doesSellerOrderExists({
                    orderDocId,
                }),
        );

        if (!sellerOrder)
            await step.run(
                "create-seller-order",
                async () =>
                    await orderService.createSellerOrders(
                        orderDocId,
                        user,
                        products,
                    ),
            );

        let {baseOrder, sellerOrders} = await step.run(
            "run-order",
            async () => await orderService.getOrderById(orderDocId, {}, {}),
            // async () => await orderService.getOrderById(orderDocId, {}, { orderDocId: new mongoose.Types.ObjectId(orderDocId) }),
        );

        // console.log(baseOrder);
        // console.log(sellerOrders);

        
        if (!baseOrder.invoice) {
            const pdfBuffer = await step.run(
                "create-invoice",
                async () => await createInvoice({baseOrder, sellerOrders}),
            );

            const { fileId, name, url } = await step.run(
                "upload-invoice",
                async () => await imageKitService.upload(pdfBuffer),
            );

            baseOrder = await step.run("update-order", async () => {
                return await orderService.updateParentOrder(
                    { _id: baseOrder._id },
                    {
                        invoice: {
                            fileId,
                            filename: name,
                            url,
                            thumbnailUrl: url,
                        },
                    },
                );
            });

            const emailData = {
                emailContent: orderPlacedInvoiceMailContent(
                    user.fullname,
                    baseOrder.orderId,
                    url,
                ),
                from: process.env.MARKETLY_EMAIL,
                to: user.email,
                subject: "Your Order Placed Successfully",
            };

            await step.run("emit-email-event", async () => {
                await inngest
                    .send({
                        name: "mail/send-mail",
                        data: emailData,
                    })
                    .catch((err) => {});
            });
        }

        console.log("reciver ID: ", baseOrder.user);

        const notificationPayload = {
            receiverId: baseOrder.user,
            docModel: "users",
            notificationType: "ORDER_UPDATE",
            title: "Order Update",
            message:
                baseOrder.status === "paid"
                    ? `Your Order Is Placed: ${baseOrder.orderId}`
                    : `Your Order Placing Failed: ${baseOrder.orderId}`,
            data: {
                orderDocId: baseOrder._id
            }
        };

        await step.run("send-order-notification", async () => {
            await inngest
                .send({
                    name: "notification/send-order-update",
                    data: {data: notificationPayload, order: baseOrder}
                })
                .catch((err) => {});
        });
    },
);

const sendChatUpdate = inngest.createFunction(
    { id: "send-chat-update" },
    { event: "notification/send-chat-update" },
    async ({ event, step }) => {
        const { chatReq, notificationPayload, isVendor } = event.data;

        console.log("EVENT: ", event.data)

        const notification = await step.run(
            "create-chat-notification",
            async () =>
                await notificationService.createNotification(
                    notificationPayload,
                ),
        );

        await step.run(
            "chat-notify",
            async () =>
                await notificationService.sendChatUpdateNotification(
                    chatReq,
                    notification,
                    isVendor
                ),
        );
    },
);

const sendOrderUpdate = inngest.createFunction(
    { id: "send-order-update" },
    { event: "notification/send-order-update" },
    async ({ event, step }) => {
        const { data, order } = event.data;

        console.log("EVENT: ", event.data)

        const notification = await step.run(
            "create-order-notification",
            async () =>
                await notificationService.createNotification(
                    data,
                ),
        );

        await step.run("order-notify", async () =>
            notificationService.sendOrderUpdateNotification(
                order,
                notification,
            ),
        );
    },
);

const sendOrdersDeliveryUpdate = inngest.createFunction(
    { id: "send-order-delivery-update" },
    { event: "notification/send-order-delivery-update" },
    async ({ event, step }) => {
        const { orders } = event.data;

        await step.run(
            "order-delivery-notify",
            async () =>
                await notificationService.sendOrderDeliveryUpdateNotification(
                    orders,
                ),
        );
    },
);

const updateOrderRefundApplication = inngest.createFunction(
    { id: "update-refund-application" },
    { event: "refund/mark-refund" },
    async ({ event, step }) => {
        const { refundId, refundDocId, amount } = event.data;

        const refundApplication = await step.run(
            "mark-refund",
            async () =>
                await orderRefundApplicationService.updateApplication(
                    { _id: refundDocId },
                    { refundId, status: "refunded" },
                ),
        );

        const emailData = {
            emailContent: refundSuccessfulMailContent(
                refundApplication.order,
                refundId,
                amount,
            ),
            from: process.env.MARKETLY_EMAIL,
            to: user.email,
            subject: "Your Amount Is Refunded Successfully",
        };

        await step.run("emit-email-event", async () => {
            await inngest
                .send({
                    name: "mail/send-mail",
                    data: emailData,
                })
                .catch((err) => {});
        });
    },
);

const functions = [
    handleMailing,
    orderFulfillment,
    sendChatUpdate,
    sendOrderUpdate,
    sendOrdersDeliveryUpdate,
    updateOrderRefundApplication,
];

export {
    inngest,
    functions,
};
