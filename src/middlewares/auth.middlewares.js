const jwt = require("jsonwebtoken");
const ApiError = require("../utils/api-error");
const { asyncHandler } = require("../utils/asyncHandler");

const isAuthenticated = asyncHandler(async (req, res, next) => {
    const authHeader = req.get("Authorization");
    const token = authHeader?.split(" ")?.[1];

    if(!authHeader || !token) throw new ApiError(401, "Bearer token is required");
    if(!authHeader.startsWith("Bearer ")) throw new ApiError(401, "Token should starts with Bearer");

    let decoded;

    try {
        decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch(error) {
        throw new ApiError(401, "Un-authenticated");    
    }

    req.user = decoded;

    next();
});

module.exports = {
    isAuthenticated
};