const {Emitter} = require("@socket.io/redis-emitter");
const {createClient} = require("redis");

const redisClient = createClient({url: process.env.REDIS_URI});
const io = new Emitter(redisClient);

module.exports = io;