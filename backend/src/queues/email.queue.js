import { Queue } from "bullmq";
import { pubClient } from "../config/redis/connection.js";

const emailQueue = new Queue("email-queue", {
    connection: pubClient,
});

export default emailQueue;
