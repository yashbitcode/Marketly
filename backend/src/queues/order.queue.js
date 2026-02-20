import { Queue } from "bullmq";
import { pubClient } from "../config/redis/connection.js";

const orderQueue = new Queue("order-queue", {
    connection: pubClient,
});

export default orderQueue;
