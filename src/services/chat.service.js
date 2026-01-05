const ChatRequest = require("../models/chatRequest.models");
const { nanoid } = require("nanoid");
const Message = require("../models/message.models");

class ChatService {
    async createChatReq(payload) {
        const { user, vendor } = payload;
        const chatRequest = new ChatRequest({
            user,
            vendor,
        });

        await chatRequest.save();

        return chatRequest;
    }

    async getAllChatReqs(filters) {
        const chatRequests = await ChatRequest.find(filters).populate(
            "user vendor",
        );

        return chatRequests;
    }

    async getChatReq(filters) {
        const chatRequest = await ChatRequest.findOne(filters).populate(
            "user vendor",
        );

        return chatRequest;
    }

    async updateChatReqStatus(chatReq, status) {
        let chatId;

        if (status === "accepted") {
            chatId = nanoid(8);
            chatReq.chatId = chatId;
        }

        chatReq.status = status;

        return {
            chatReq,
            chatId,
        };
    }

    async createMessage(payload) {
        const { senderId, docModel, message, chatId, attachments } = payload;
        const msgDoc = new Message({
            senderId,
            docModel,
            message,
            chatId,
            attachments,
        });

        await msgDoc.save();

        return msgDoc;
    }
}

module.exports = new ChatService();