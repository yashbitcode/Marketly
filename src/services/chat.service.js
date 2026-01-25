const ChatRequest = require("../models/chatRequest.models");
const { nanoid } = require("nanoid");
const Message = require("../models/message.models");
const { GENERAL_USER_FIELDS } = require("../utils/constants");
const { getPaginationBasePipeline } = require("../utils/helpers");

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

    async getAllChatReqs(matchStage = {}, page = 1) {
        const basePagination = getPaginationBasePipeline(+page);

        const [chatRequests] = await ChatRequest.aggregate([
            {
                $match: matchStage,
            },
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user",
                    pipeline: [
                        {
                            $project: GENERAL_USER_FIELDS,
                        }
                    ]
                },
            },
            {
                $lookup: {
                    from: "vendors",
                    localField: "vendor",
                    foreignField: "_id",
                    as: "vendor",
                },
            },
            {
                $addFields: {
                    user: { $arrayElemAt: ["$user", 0] },
                    vendor: { $arrayElemAt: ["$vendor", 0] },
                },
            },
            ...basePagination,
        ]);

        return chatRequests;
    }

    async getChatReq(filters) {
        const chatRequest = await ChatRequest.findOne(filters).populate([
            {
                path: "user",
                select: GENERAL_USER_FIELDS,
            },
            {
                path: "vendor",
            },
        ]);

        return chatRequest;
    }

    async updateChatReqStatus(chatReq, status) {
        let chatId;

        if (status === "accepted") {
            chatId = nanoid(8);
            chatReq.chatId = chatId;
        }

        chatReq.status = status;

        await chatReq.save();

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
