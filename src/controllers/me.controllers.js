const ApiResponse = require("../utils/api-response");
const { asyncHandler } = require("../utils/asyncHandler");

const getMe = asyncHandler(async (req, res) => {
    const user = req.user;
    res.json(new ApiResponse(200, user, "User fetched successfully"));
});

module.exports = {getMe};