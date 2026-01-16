require("dotenv").config();
const { Emitter } = require("@socket.io/redis-emitter");
const { createClient } = require("redis");

let redisClient;
let io;
let initialising;

const initEmitter = async () => {
    if (io) return io;
    if (initialising) return initialising;

    initialising = (async () => {
        redisClient = createClient({ url: process.env.REDIS_URI });
        await redisClient.connect();

        io = new Emitter(redisClient);

        return io;
    })();

    return initialising;
};

module.exports = initEmitter;
