import ApiResponse from "../utils/api-response.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import userService from "../services/user.service.js";
import { GENERAL_USER_FIELDS } from "shared/constants.js";
import { pubClient as redisClient } from "../config/redis/connection.js";
import imageKitService from "../services/imageKit.service.js";

const getAllUsers = asyncHandler(async (req, res) => {
    const { page } = req.params;

    const { data, totalCount } = await userService.getAll(page);

    res.json(
        new ApiResponse(
            200,
            { users: data, totalCount },
            "Users fetched successfully",
        ),
    );
});

const updateUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { avatar } = req.body;

    if (avatar) {
        const user = await userService.getUserById(_id);

        if (user.avatar)
            await imageKitService.deleteImages([user.avatar.fileId]);
    }

    const updatedUser = await userService.updateUserData(
        { _id },
        req.body,
        GENERAL_USER_FIELDS,
    );
    await redisClient.del(`user:${_id}`);

    res.json(new ApiResponse(200, updatedUser, "User updated successfully"));
});

export { updateUser, getAllUsers };
