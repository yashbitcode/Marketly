require("dotenv").config();
const { Redis } = require("ioredis");

const pubClient = new Redis(process.env.REDIS_URI, {
    maxRetriesPerRequest: null,
});
const subClient = pubClient.duplicate();

module.exports = { pubClient, subClient };
