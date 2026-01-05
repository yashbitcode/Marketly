const { Server } = require("socket.io");
const { isSocketAuthenticated } = require("../middlewares/auth.middlewares");
const { createMessageValidations } = require("../validations/chat.validations");
const chatService = require("../services/chat.service");

const setupSocketIO = (httpServer) => {
    const io = new Server(httpServer, {
        connectionStateRecovery: {}
    });

    io.use(isSocketAuthenticated);

    const chatNamespace = io.of("/chat");
    const orderNamespace = io.of("/order");
    const notificationNamespace = io.of("/notification");

    chatNamespace.on('connection', (socket) => {
        const roomId = "room:" + socket.handshake?.chatId;
        socket.join(roomId);

        socket.on("chat-message", async (payload) => {
            const validation = createMessageValidations.safeParse(payload);

            if(!validation.success) return;
            
            const message = await chatService.createMessage(validation.success);
        });
    })
};

module.exports = {
    setupSocketIO
}