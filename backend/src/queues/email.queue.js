const { Queue } = require("bullmq");
const { pubClient } = require("../config/redis/connection");

const emailQueue = new Queue("email-queue", {
    connection: pubClient,
});

module.exports = emailQueue;
