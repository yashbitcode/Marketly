const ApiResponse = require("../utils/api-response");
const User = require("../models/user.models");
const { asyncHandler } = require("../utils/asyncHandler");
const userService = require("../services/user.service");

const getUser = asyncHandler(async (req, res) => {
    const user = req.user;
    res.json(new ApiResponse(200, user, "User fetched successfully"));
});

const updateUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    
    const user = await userService.updateUserData(_id, req.body);

    res.json(user);
});

module.exports = {
    getUser,
    updateUser
};
