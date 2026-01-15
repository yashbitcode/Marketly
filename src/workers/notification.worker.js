const { Worker } = require("bullmq");
const {
    sendChatUpdateJob,
    sendOrderUpdateJob,
    sendOrdersDeliveryUpdateJob,
} = require("../jobs/notification.jobs");

const worker = new Worker("order-queue", async (job) => {
    const jobName = job.name;

    switch (jobName) {
        case "chat-update": {
            await sendChatUpdateJob(job);
        }
        case "order-placed": {
            await sendOrderUpdateJob(job);
        }
        case "order-delivery-update": {
            await sendOrdersDeliveryUpdateJob(job);
        }
    }
});
