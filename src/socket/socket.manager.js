const { Server } = require("socket.io");
const ApiError = require("../utils/api-error");

let io = null;

const initSocket = (httpServer) => {
    io = new Server(httpServer, {
        connectionStateRecovery: {},
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
