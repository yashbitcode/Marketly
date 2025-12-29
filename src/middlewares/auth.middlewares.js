const jwt = require("jsonwebtoken");
const ApiError = require("../utils/api-error");
const { asyncHandler } = require("../utils/asyncHandler");
const userService = require("../services/user.service");
const vendorService = require("../services/vendor.service");

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
    const { _id: mainId, role } = await verifyToken(req.get("Authorization"));
    let payload;

    if (role === "user") {
        payload = await userService.getUserById(mainId, {
            fullname: 1,
            email: 1,
            username: 1,
            avatar: 1,
            phoneNumber: 1,
            isEmailVerified: 1,
        });

        // if (tokenVersion !== mainTokenVersion) {
        //     res.clearCookie("accessToken");
        //     res.clearCookie("refreshToken");

        //     throw new ApiError(401, "Un-authenticated token invalidated");
        // }

        // const userData = {
        //     _id,
        //     fullname,
        //     email,
        //     username,
        //     role,
        //     avatar,
        //     phoneNumber,
        //     isEmailVerified,
        // };

        // req.user = userData;
    } else {
        payload = await vendorService.getVendorById(
            _id,
            {},
            {
                fullname: 1,
                email: 1,
                username: 1,
                avatar: 1,
                phoneNumber: 1,
                isEmailVerified: 1,
            },
        );
    }

    if(!payload) throw new ApiError(401, "Un-Authenticated");

    payload.role = role;
    req.user = payload;

    next();
});

module.exports = {
    isAuthenticated,
};
