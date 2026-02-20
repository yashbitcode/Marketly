import ApiResponse from "../utils/api-response.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import userService from "../services/user.service.js";

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

    const user = await userService.updateUserData({ _id }, req.body);

    res.json(new ApiResponse(200, user, "User updated successfully"));
});

export { updateUser, getAllUsers };
