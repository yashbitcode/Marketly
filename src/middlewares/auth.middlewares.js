const jwt = require("jsonwebtoken");
const ApiError = require("../utils/api-error");
const { asyncHandler } = require("../utils/asyncHandler");
const userService = require("../services/user.service");
const { GENERAL_USER_FIELDS } = require("../utils/constants");

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
    const { _id, currentRole, tokenVersion } = await verifyToken(
        req.get("Authorization"),
    );

    let payload;

    if (currentRole === "vendor")
        payload = await userService.getUserWithVendor(
            { _id },
            GENERAL_USER_FIELDS,
        );
    else payload = await userService.getUserById(_id, GENERAL_USER_FIELDS);

    if (!payload) throw new ApiError(401, "Un-Authenticated");

    if (payload.tokenVersion !== tokenVersion) {
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        throw new ApiError(401, "Un-authenticated token invalidated");
    }

    req.user = payload;
    req.user.currentRole = currentRole;

    next();
});

const isSocketAuthenticated = async (socket, next) => {
    const token = socket.handshake?.auth.token;
    const decoded = await verifyToken(token);

    const user = await userService.getUserById(
        decoded._id,
        GENERAL_USER_FIELDS,
    );

    if (user.role === "super-admin")
        next(new ApiError(401, "Un-Authenticated"));
    else {
        socket.user = user;
        next();
    }
};

const authorise = (...allowedRoles) => {
    return asyncHandler(async (req, res, next) => {
        if (!allowedRoles.includes(req.user.currentRole))
            throw new ApiError(403, "Forbidden: insufficient permissions");

        next();
    });
};

module.exports = {
    isAuthenticated,
    isSocketAuthenticated,
    authorise,
};
