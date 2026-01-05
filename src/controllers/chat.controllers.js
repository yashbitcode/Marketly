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

    res.json(
        new ApiResponse(
            200,
            updatedChatReq,
            "Chat request updated successfully",
        ),
    );
});

const getAllUserChats = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const allChatReqs = await chatService.getAllChatReqs({ user: _id });

    res.json(new ApiResponse(200, allChatReqs, "Chats fetched successfully"));
});

const getAllVendorChats = asyncHandler(async (req, res) => {
    const { _id } = req.user.vendor;
    const allChatReqs = await chatService.getAllChatReqs({ vendor: _id });

    res.json(new ApiResponse(200, allChatReqs, "Chats fetched successfully"));
});

const getAllChats = asyncHandler(async (req, res) => {
    const allChatReqs = await chatService.getAllChatReqs();

    res.json(new ApiResponse(200, allChatReqs, "Chats fetched successfully"));
});

module.exports = {
    createChatRequest,
    updateChatRequest,
    getAllUserChats,
    getAllVendorChats,
    getAllChats,
}

// const createMessage = asyncHandler(async (req, res) => {
//     const payload = req.body;

//     const message = await chatService.createMessage(payload);

//     res.json(new ApiResponse(201, message, "Message created successfully"));
// });
