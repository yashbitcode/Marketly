const { Worker } = require("bullmq");
const { orderJob } = require("../jobs/order.jobs");
const { workerDBConnect } = require("../utils/dbConnectWorker");
const { pubClient } = require("../config/redis/connection");

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
