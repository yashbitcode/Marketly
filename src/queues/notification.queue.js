const { Queue } = require("bullmq");
const { pubClient } = require("../config/redis/connection");

const notificationQueue = new Queue("notification-queue", {
    connection: pubClient,
});

module.exports = notificationQueue;
