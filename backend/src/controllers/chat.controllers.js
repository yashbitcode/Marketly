import { inngest } from "../inngest/index.js";
import chatService from "../services/chat.service.js";
import ApiResponse from "../utils/api-response.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createChatRequest = asyncHandler(async (req, res) => {
    const { vendor } = req.body;
    const user = req.user;
    const chatReq = await chatService.createChatReq({ vendor, user: user._id });

    // console.log(user)
    // console.log(chatReq)

    const notificationPayload = {
        receiverId: chatReq.vendor,
        docModel: "vendors",
        notificationType: "CHAT_REQUEST_UPDATE",
        title: "New Chat Request",
        message: `New Chat Request From: ${user.fullname}`,
        data: {
            chatReqId: chatReq._id,
        },
    };

    await inngest
        .send({
            name: "notification/send-chat-update",
            data: { notificationPayload, isVendor: true, chatReq },
        })
        .catch((err) => next(err));

    res.json(
        new ApiResponse(201, chatReq, "Chat request created successfully"),
    );
});

const updateChatRequest = asyncHandler(async (req, res, next) => {
    const { status, chatReqId } = req.body;

    const chatReq = await chatService.getChatReq({ _id: chatReqId });

    if (!chatReq) throw new ApiError(400, "Chat request doesn't exist");

    const updatedChatReq = await chatService.updateChatReqStatus(
        chatReq,
        status,
    );

    const notificationPayload = {
        receiverId: chatReq.user,
        docModel: "users",
        notificationType: "CHAT_REQUEST_UPDATE",
        title: "Chat Request Update",
        message: `Your Recent Chat Request Is: ${status}`,
    };

    await inngest
        .send({
            name: "notification/send-chat-update",
            data: { notificationPayload, isVendor: false, chatReq },
        })
        .catch((err) => next(err));

    res.json(
        new ApiResponse(
            200,
            updatedChatReq,
            "Chat request updated successfully",
        ),
    );
});

const getAllChatsReqs = asyncHandler(async (req, res) => {
    const { page } = req.params;
    const matchStage = {};

    // if (req.user.currentRole === "user") matchStage.user = req.user._id;
    // if (req.user.currentRole === "vendor")
    //     matchStage.vendor = req.user.vendorId._id;

    const allChatReqs = await chatService.getAllChatReqs(matchStage, page);

    res.json(new ApiResponse(200, allChatReqs, "Chats fetched successfully"));
});

const getMessages = asyncHandler(async (req, res) => {
    const user = req.user;
    const { chatId } = req.params;

    const filters = {
        chatId,
        status: {
            $ne: "pending",
        },
    };
    if (user.currentRole === "user") filters.user = user._id;
    else if (user.currentRole === "vendor") filters.vendor = user.vendorId._id;

    const data = await chatService.getMessages(chatId, filters);
    res.json(new ApiResponse(200, data, "Messages fetched successfully"));
});

export { createChatRequest, updateChatRequest, getAllChatsReqs, getMessages };
