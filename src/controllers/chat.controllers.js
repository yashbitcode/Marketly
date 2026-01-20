const notificationQueue = require("../queues/notification.queue");
const chatService = require("../services/chat.service");
const ApiResponse = require("../utils/api-response");
const { asyncHandler } = require("../utils/asyncHandler");

const createChatRequest = asyncHandler(async (req, res) => {
    const payload = req.body;
    const chatReq = await chatService.createChatReq(payload);

    res.json(
        new ApiResponse(201, chatReq, "Chat request created successfully"),
    );
});

const updateChatRequest = asyncHandler(async (req, res) => {
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

    await notificationQueue.add(
        "chat-update",
        { notificationPayload, chatReq: updatedChatReq.chatReq },
        {
            removeOnComplete: true,
            removeOnFail: true,
            attempts: 3,
        },
    );

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

const getAllChats = asyncHandler(async (req, res) => {
    const filters = {};

    if (req.user.currentRole === "user") filters.user = req.user._id;
    if (req.user.currentRole === "vendor")
        filters.vendor = req.user.vendorId._id;

    const allChatReqs = await chatService.getAllChatReqs(filters);

    res.json(new ApiResponse(200, allChatReqs, "Chats fetched successfully"));
});

module.exports = {
    createChatRequest,
    updateChatRequest,
    getAllChats,
};

// const createMessage = asyncHandler(async (req, res) => {
//     const payload = req.body;

//     const message = await chatService.createMessage(payload);

//     res.json(new ApiResponse(201, message, "Message created successfully"));
// });
