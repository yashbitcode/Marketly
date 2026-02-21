import { isSocketAuthenticated } from "../../middlewares/auth.middlewares.js";
import { createMessageValidations } from "../../../../shared/validations/chat.validations.js";
import chatService from "../../services/chat.service.js";

const setupSocketIO = (io) => {
    io.use(isSocketAuthenticated);

    // io.on("connection", (socket) => {
    //     socket.join("/main");
    //     console.log("conn");
    // });

    const chatNamespace = io.of("/chat");
    const orderNamespace = io.of("/order");
    const notificationNamespace = io.of("/notification");

    chatNamespace.on("connection", (socket) => {
        socket.on("join", (chatId) => {
            socket.join("chat:" + chatId);
        });

        socket.on("chat-message", async (payload) => {
            const validation = createMessageValidations.safeParse(payload);

            if (!validation.success) return;

            const message = await chatService.createMessage(validation.success);
        });
    });

    orderNamespace.on("connection", (socket) => {
        socket.on("join", (orderId) => {
            socket.join("order:" + orderId);
        });
    });

    notificationNamespace.on("connection", (socket) => {
        socket.on("join", (userId) => {
            socket.join("notification:" + userId);
        });
    });
};

export { setupSocketIO };
