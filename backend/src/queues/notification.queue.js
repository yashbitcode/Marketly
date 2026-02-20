import { Queue } from "bullmq";
import { pubClient } from "../config/redis/connection.js";

const notificationQueue = new Queue("notification-queue", {
    connection: pubClient,
});

export default notificationQueue;
