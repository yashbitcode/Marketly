import { Worker } from "bullmq";
import { orderJob } from "../jobs/order.jobs.js";
import { workerDBConnect } from "../utils/dbConnectWorker.js";
import { pubClient } from "../config/redis/connection.js";

workerDBConnect(() => {
    const worker = new Worker(
        "order-queue",
        async (job) => {
            const jobName = job.name;

            switch (jobName) {
                case "order-fulfillment": {
                    await orderJob(job);
                }
            }
        },
        {
            connection: pubClient,
            concurrency: 5,
        },
    );
});
