import jwt from "jsonwebtoken";
import ApiError from "../utils/api-error.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import userService from "../services/user.service.js";
import { GENERAL_USER_FIELDS } from "../../../shared/constants.js";
import { pubClient as redisClient } from "../config/redis/connection.js";

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
    const { _id, vendorId, currentRole, tokenVersion } = await verifyToken(
        req.get("Authorization"),
    );

    let payload;

    if (currentRole === "vendor") {
        payload = JSON.parse(await redisClient.get(`vendor:${vendorId}`));

        // payload = await userService.getUserWithVendor(
        //     { _id },
        //     GENERAL_USER_FIELDS,
        // );
        // console.log(payload);
    } else {
        payload = JSON.parse(await redisClient.get(`user:${_id}`));

        // payload = await userService.getUserById(_id, GENERAL_USER_FIELDS);
    }

    if (!payload || payload.tokenVersion !== tokenVersion) {
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        if (!payload) throw new ApiError(401, "Un-Authenticated");

        const keyToDelete =
            currentRole === "vendor" ? `vendor:${vendorId}` : `user:${_id}`;

        await redisClient.del(keyToDelete);

        throw new ApiError(401, "Un-authenticated token invalidated");
    }

    // if (!payload) throw new ApiError(401, "Un-Authenticated");

    // if (payload.tokenVersion !== tokenVersion) {
    //     res.clearCookie("accessToken");
    //     res.clearCookie("refreshToken");

    //     const keyToDelete = currentRole === "vendor" ?`vendor:${vendorId}` : `user:${_id}`;

    //     await redisClient.del(keyToDelete);

    //     throw new ApiError(401, "Un-authenticated token invalidated");
    // }

    req.user = payload;
    req.user.currentRole = currentRole;

    next();
});

const isSocketAuthenticated = async (socket, next) => {
    let token = socket.handshake?.auth.token;

    try {
        const decoded = await verifyToken(token);

        const user = await userService.getUserById(
            decoded._id,
            GENERAL_USER_FIELDS,
        );

        if (user.role !== "super-admin") socket.user = user;
        next();
    } catch (error) {
        next(new ApiError(error.statusCode), error.message);
    }

    // token = token?.split(" ")?.[1];

    // if (!token) return next(new ApiError(400, "Token is required"));

    // let decoded;

    // try {
    //     decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    //     const user = await userService.getUserById(
    //         decoded._id,
    //         GENERAL_USER_FIELDS,
    //     );

    //     if (user.role !== "super-admin") socket.user = user;
    //     next();
    // } catch (error) {
    //     next(new ApiError(400, "Invalid token"));
    // }
};

const authorise = (...allowedRoles) => {
    return asyncHandler(async (req, res, next) => {
        if (!allowedRoles.includes(req.user.currentRole))
            throw new ApiError(403, "Forbidden: insufficient permissions");

        next();
    });
};

export { isAuthenticated, isSocketAuthenticated, authorise };
