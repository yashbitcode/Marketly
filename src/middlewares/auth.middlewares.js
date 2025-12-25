const jwt = require("jsonwebtoken");
const ApiError = require("../utils/api-error");
const { asyncHandler } = require("../utils/asyncHandler");
const userService = require("../services/user.service");

const verifyToken = async (authHeader) => {
    const token = authHeader?.split(" ")?.[1];

    if (!authHeader || !token)
        throw new ApiError(401, "Bearer token is required");
    if (!authHeader.startsWith("Bearer "))
        throw new ApiError(401, "Token should starts with Bearer");

    let decoded;

    try {
        decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
        throw new ApiError(401, "Un-authenticated");
    }

    return decoded;
};

const isAuthenticated = asyncHandler(async (req, res, next) => {
    const { _id: mainId, tokenVersion: mainTokenVersion } = await verifyToken(
        req.get("Authorization"),
    );

    const {
        _id,
        fullname,
        email,
        username,
        role,
        avatar,
        phoneNumber,
        isEmailVerified,
        tokenVersion
    } = await userService.getUserById(mainId);

    if (tokenVersion !== mainTokenVersion) {
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        throw new ApiError(401, "Un-authenticated token invalidated");
    }

    const userData = {
        _id,
        fullname,
        email,
        username,
        role,
        avatar,
        phoneNumber,
        isEmailVerified,
    };

    req.user = userData;

    next();
});

module.exports = {
    isAuthenticated,
};