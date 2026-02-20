// import notificationQueue from "../queues/notification.queue";
import { inngest } from "../inngest/index.js";
import chatService from "../services/chat.service.js";
import ApiResponse from "../utils/api-response.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createChatRequest = asyncHandler(async (req, res) => {
    const payload = req.body;
    const chatReq = await chatService.createChatReq(payload);

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
        docModel: "user",
        notificationType: "CHAT_REQUEST_UPDATE",
        title: "Chat Request Update",
        message: `Your Recent Chat Request Is: ${status}`,
    };

    // await notificationQueue.add(
    //     "chat-update",
    //     { notificationPayload, chatReq: updatedChatReq.chatReq },
    //     {
    //         removeOnComplete: true,
    //         removeOnFail: true,
    //         attempts: 3,
    //     },
    // );

    await inngest
        .send({
            name: "notification/send-chat-update",
            data: notificationPayload,
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

// const getAllUserChats = asyncHandler(async (req, res) => {

//     const { _id } = req.user;
//     const allChatReqs = await chatService.getAllChatReqs({ user: _id });

//     res.json(new ApiResponse(200, allChatReqs, "Chats fetched successfully"));
// });

// const getAllVendorChats = asyncHandler(async (req, res) => {
//     const { _id } = req.user.vendor;
//     const allChatReqs = await chatService.getAllChatReqs({ vendor: _id });

//     res.json(new ApiResponse(200, allChatReqs, "Chats fetched successfully"));
// });

const getAllChatsReqs = asyncHandler(async (req, res) => {
    const { page } = req.params;
    const matchStage = {};

    // if (req.user.currentRole === "user") matchStage.user = req.user._id;
    // if (req.user.currentRole === "vendor")
    //     matchStage.vendor = req.user.vendorId._id;

    const allChatReqs = await chatService.getAllChatReqs(matchStage, page);

    res.json(new ApiResponse(200, allChatReqs, "Chats fetched successfully"));
});

export {
    createChatRequest,
    updateChatRequest,
    getAllChatsReqs,
};

// const createMessage = asyncHandler(async (req, res) => {
//     const payload = req.body;

//     const message = await chatService.createMessage(payload);

//     res.json(new ApiResponse(201, message, "Message created successfully"));
// });
