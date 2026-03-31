import jwt from "jsonwebtoken";
import ApiError from "../utils/api-error.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import userService from "../services/user.service.js";
import { GENERAL_USER_FIELDS } from "../../../shared/constants.js";
import { pubClient as redisClient } from "../config/redis/connection.js";
import { getAccessToken } from "../utils/helpers.js";

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

const getPayload = async (decoded) => {
    const { _id, vendorId, currentRole } = decoded;
    let payload;

    // console.log(decoded)

    if (currentRole === "vendor") {
        // payload = JSON.parse(await redisClient.get(`vendor:${vendorId}`));

        if (!payload) {
            payload = await userService.getUserWithVendor(
                { _id },
                GENERAL_USER_FIELDS,
            );
            // await redisClient.set(`vendor:${_id}`, JSON.stringify(payload));
        }
    } else {
        // payload = JSON.parse(await redisClient.get(`user:${_id}`));

        if (!payload) {
            payload = await userService.getUserById(_id, GENERAL_USER_FIELDS);
            // await redisClient.set(`user:${_id}`, JSON.stringify(payload));
        }
    }

    return payload;
}

const isAuthenticated = asyncHandler(async (req, res, next) => {
    const token =
        req.get("Authorization") ||
        (req.cookies.accessToken && `Bearer ${req.cookies.accessToken}`);

    // console.log("TOKEN: ", token);

    const { _id, vendorId, currentRole, tokenVersion } =
        await verifyToken(token);

        // console.log("DEC: ", { _id, vendorId, currentRole, tokenVersion })
    
    const payload = await getPayload({_id, vendorId, currentRole})
    

    if (!payload || payload.tokenVersion !== tokenVersion) {
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        if (!payload) throw new ApiError(401, "Un-Authenticated");

        const keyToDelete =
            currentRole === "vendor" ? `vendor:${vendorId}` : `user:${_id}`;

        await redisClient.del(keyToDelete);

        throw new ApiError(401, "Un-authenticated token invalidated");
    }

    req.user = {...payload?._doc, currentRole};

    next();
});

const isAuthenticatedErrorHandler = async (req, res, next) => {
    try {
        await isAuthenticated(req, res, next);
    } catch {
        next();
    }
};

const isSocketAuthenticated = async (socket, next) => {
    let token = getAccessToken(socket.handshake?.headers?.cookie);

    try {
        const decoded = await verifyToken(token ? "Bearer " + token : "");

        const payload = await getPayload(decoded);
        
        if (payload.role !== "super-admin") {
            socket.user = payload;
            socket.user.currentRole = decoded.currentRole;
        }
        
        next();
    } catch (error) {
        console.log(error)
        next(new ApiError(error.statusCode), error.message);
    }
};

const authorise = (...allowedRoles) => {
    return asyncHandler(async (req, res, next) => {
        console.log("AUTH: ", req.user)
        if (!allowedRoles.includes(req.user.currentRole))
            throw new ApiError(403, "Forbidden: insufficient permissions");

        next();
    });
};

export { isAuthenticated, isAuthenticatedErrorHandler,isSocketAuthenticated, authorise };
