import notificationService from "../services/notification.service.js";
import ApiResponse from "../utils/api-response.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getAllNotifications = asyncHandler(async (req, res) => {
    const filters = {};
    
    if (req.user.currentRole === "user") filters.receiverId = req.user._id;
    if (req.user.currentRole === "vendor")
        filters.receiverId = req.user.vendorId._id;

    console.log(filters)

    const allNotifications =
        await notificationService.getAllNotification(filters);

        console.log(allNotifications)

    res.json(new ApiResponse(200, allNotifications, "Notifications fetched successfully"));
});

export const markNotificationAsRead = asyncHandler(async (req, res) => {
    const { notificationId } = req.params;

    if(!notificationId) throw new ApiError(400, "Notification ID is required");
    
    const updatedNotification = await notificationService.markNotificationAsRead(notificationId);

    if(!updatedNotification) throw new ApiError(404, "Notification not found");

    res.json(new ApiResponse(200, updatedNotification, "Notification marked as read successfully"));
});