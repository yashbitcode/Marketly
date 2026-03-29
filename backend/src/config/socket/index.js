import { isSocketAuthenticated } from "../../middlewares/auth.middlewares.js";
import { createMessageValidations } from "../../../../shared/validations/chat.validations.js";
import chatService from "../../services/chat.service.js";

const setupSocketIO = (io) => {
    // io.on("connection", (socket) => {
    //     socket.join("/main");
    //     console.log("conn");
    // });

    const chatNamespace = io.of("/chat");
    const orderNamespace = io.of("/order");
    const notificationNamespace = io.of("/notification");

    chatNamespace.use(isSocketAuthenticated);
    orderNamespace.use(isSocketAuthenticated);
    notificationNamespace.use(isSocketAuthenticated);

    const onlineUser = {};
    
    chatNamespace.on("connection", (socket) => {
        const baseId = socket.user.currentRole === "vendor" ? socket.user.vendorId._id : socket.user._id;

        socket.on("join", (chatId) => {
            socket.join("chat:" + chatId);
            socket.chatId = chatId;

            onlineUser[baseId] = socket.id;
            chatNamespace.to("chat:" + socket.chatId).emit("online-users", Object.keys(onlineUser));
        });

        socket.on("send-message", async (payload) => {
            const validation = createMessageValidations.safeParse(payload);

            if (!validation.success) return;

            const message = await chatService.createMessage(validation.data);

            chatNamespace.to("chat:" + socket.chatId).emit("receive-message", message);
        });

        socket.on("end-chat", async () => {
            const chatReq = await chatService.endChat(socket.chatId);

            chatNamespace.to("chat:" + socket.chatId).emit("chat-ended", chatReq);
        })

        socket.on("disconnect", async () => {
            delete onlineUser[baseId];

            console.log("DISCONNECT: ", socket.id);
            chatNamespace.to("chat:" + socket.chatId).emit("online-users", Object.keys(onlineUser));
        })
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
