import ApiResponse from "../utils/api-response.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getMe = asyncHandler(async (req, res) => {
    const user = req.user;
    console.log("USER: ", user);
    res.json(new ApiResponse(200, user, "User fetched successfully"));
});

export { getMe };
