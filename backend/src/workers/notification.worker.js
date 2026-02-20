import { Worker } from "bullmq";
import {
    sendChatUpdateJob,
    sendOrderUpdateJob,
    sendOrdersDeliveryUpdateJob,
} from "../jobs/notification.jobs.js";
import { workerDBConnect } from "../utils/dbConnectWorker.js";
import { pubClient } from "../config/redis/connection.js";

workerDBConnect(() => {
    const worker = new Worker(
        "notification-queue",
        async (job) => {
            const jobName = job.name;

            switch (jobName) {
                case "chat-update": {
                    await sendChatUpdateJob(job);
                    break;
                }
                case "order-placed": {
                    await sendOrderUpdateJob(job);
                    break;
                }
                case "order-delivery-update": {
                    await sendOrdersDeliveryUpdateJob(job);
                    break;
                }
            }

            // worker.on("completed", (job) => {
            //     console.log(`${job.id} has completed!`);
            // });

            // worker.on("failed", (job, err) => {
            //     console.log(`${job.id} has failed with ${err.message}`);
            // });
        },
        {
            connection: pubClient,
            concurrency: 5,
        },
    );
});
