const {Worker} = require("bullmq");
const { orderJob } = require("../jobs/order.jobs");

const worker = new Worker("order-queue", async (job) => {
    const jobName = job.name;

    switch(jobName) {
        case "order-fulfillment": {
            await orderJob(job);
        }
    }
});