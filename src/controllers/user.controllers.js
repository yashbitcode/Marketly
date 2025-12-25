const ApiResponse = require("../utils/api-response");
const User = require("../models/user.models");
const { asyncHandler } = require("../utils/asyncHandler");

const getUser = asyncHandler(async (req, res) => {
    const user = req.user;
    res.json(new ApiResponse(200, user, "User fetched successfully"));
});

const updateUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    
    const user = await User.findByIdAndUpdate(_id, req.body, {
        runValidators: true,
        returnDocument: "after",
    });

    res.json(user);
});

module.exports = {
    getUser,
    updateUser
};
