const {Queue} = require("bullmq");
const connection = require("../config/redis/connection");

const emailQueue = new Queue("email-queue", {
    connection
});

module.exports = emailQueue;