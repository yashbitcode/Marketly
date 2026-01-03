const { asyncHandler } = require("../utils/asyncHandler");
const imageKitService = require("../services/imageKit.service");
const ApiResponse = require("../utils/api-response");

const getAuthParams = asyncHandler(async (req, res) => {
    const { token, expire, signature } = await imageKitService.getParams();

    res.json(new ApiResponse(201, {token, expire, signature}, "Images uploading successfully"));
});

module.exports = {
    getAuthParams,
};
