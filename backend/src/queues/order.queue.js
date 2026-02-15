const { Queue } = require("bullmq");
const { pubClient } = require("../config/redis/connection");

const orderQueue = new Queue("order-queue", {
    connection: pubClient,
});

module.exports = orderQueue;
