import ChatRequest from "../models/chatRequest.models.js";
import { nanoid } from "nanoid";
import Message from "../models/message.models.js";
import { GENERAL_USER_FIELDS } from "../../../shared/constants.js";
import { getPaginationBasePipeline } from "../utils/helpers.js";
import ApiError from "../utils/api-error.js";

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
                        },
                    ],
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
        const { senderId, docModel, message, chatId } = payload;
        const msgDoc = new Message({
            senderId,
            docModel,
            message,
            chatId,
        });

        await msgDoc.save();

        return msgDoc;
    }

    async getMessages(chatId, filters = {}) {
        const chatReq = await this.getChatReq(filters);

        console.log(chatReq)

        if (!chatReq) throw new ApiError(400, "Chat request doesn't exist");

        const messages = await Message.find({chatId}).sort({createdAt: 1});
        return {messages, chatReq};
    }

    async endChat(chatId) {
        const chatReq = await this.getChatReq({chatId});

        if (!chatReq) throw new ApiError(400, "Chat request doesn't exist");

        chatReq.status = "ended";

        await chatReq.save();

        return chatReq;
    }
}

export default new ChatService();
