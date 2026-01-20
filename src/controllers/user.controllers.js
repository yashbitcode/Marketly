const ApiResponse = require("../utils/api-response");
const { asyncHandler } = require("../utils/asyncHandler");
const userService = require("../services/user.service");
const { GENERAL_USER_FIELDS } = require("../utils/constants");

const getAllUsers = asyncHandler(async (req, res) => {
    const allUsers = await userService.getAll({}, GENERAL_USER_FIELDS);

    res.json(new ApiResponse(200, allUsers, "Users fetched successfully"));
});

const updateUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;

    const user = await userService.updateUserData(_id, req.body);

    res.json(new ApiResponse(200, user, "User updated successfully"));
});

module.exports = {
    updateUser,
    getAllUsers
};
