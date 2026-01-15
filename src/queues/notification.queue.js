const {Queue} = require("bullmq");
const connection = require("../config/redis/connection");

const notificationQueue = new Queue("notification-queue", {
    connection
});

module.exports = notificationQueue;