import "dotenv/config";
import { Worker } from "bullmq";
import { sendMailJob } from "../jobs/email.jobs.js";
import { pubClient } from "../config/redis/connection.js";

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
