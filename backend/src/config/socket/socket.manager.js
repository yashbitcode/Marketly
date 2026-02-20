import { Server } from "socket.io";
import ApiError from "../../utils/api-error.js";
import { createAdapter } from "@socket.io/redis-adapter";
import { pubClient, subClient } from "../redis/connection.js";

let io = null;

const initSocket = (httpServer) => {
    io = new Server(httpServer, {
        connectionStateRecovery: {},
        adapter: createAdapter(pubClient, subClient),
    });

    return io;
};

const getIO = () => {
    if (!io) throw new ApiError();

    return io;
};

export { initSocket, getIO };
