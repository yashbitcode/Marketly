const { Server } = require("socket.io");
const ApiError = require("../utils/api-error");
const { createAdapter } = require("@socket.io/redis-adapter");
const { pubClient, subClient } = require("../config/redis/connection");

let io = null;

const initSocket = (httpServer) => {
    io = new Server(httpServer, {
        connectionStateRecovery: {},
        adapter: createAdapter(pubClient, subClient)
    });

    return io;
};

const getIO = () => {
    if (!io) throw new ApiError();

    return io;
};

module.exports = {
    initSocket,
    getIO,
};
