require("dotenv").config();
const { Worker } = require("bullmq");
const { sendMailJob } = require("../jobs/email.jobs");
const { pubClient } = require("../config/redis/connection");

const worker = new Worker(
    "email-queue",
    async (job) => {
        const jobName = job.name;

        switch (jobName) {
            case "send-email": {
                await sendMailJob(job);
            }
        }
    },
    {
        connection: pubClient,
        concurrency: 5,
    },
);
