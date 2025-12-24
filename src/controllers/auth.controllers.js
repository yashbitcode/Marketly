const { asyncHandler } = require("../utils/asyncHandler");
const userService = require("../services/user.service");
const User = require("../models/user.models");
const ApiError = require("../utils/api-error");
const bcrypt = require("bcrypt");
const ApiResponse = require("../utils/api-response");
const { COOKIE_OPTIONS } = require("../utils/constants");

const register = asyncHandler(async (req, res) => {
    const user = await userService.createNewUser(req.body);
    res.json(new ApiResponse(200, user, "User registered successfully"));
});

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await userService.getUserByEmail(email);

    if (!user) throw new ApiError(400, "Invalid credentials");

    const isPasswordCorrect = await user.verifyPassword(password);

    if (!isPasswordCorrect) throw new ApiError(400, "Invalid credentials");

    const payload = {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified,
    };

    if (!user.isEmailVerified) {
        const { sessionId, hashedSessionId, token, expiryDate } =
            User.generateTokens();

        const payload = {
            _id: user._id,
            username: user.username,
            email: user.email,
            sessionId: sessionId,
        };

        user.emailVerificationToken = token;
        user.emailVerificationSessionId = hashedSessionId;
        user.emailVerificationTokenExpiry = expiryDate;

        await user.save();

        res.status(422).json(
            new ApiResponse(422, payload, "User is not verified"),
        );
    }

    const { accessToken, refreshToken } = user.generateAccessAndRefreshTokens();
    user.refreshToken = refreshToken;

    await user.save();

    res.cookie("accessToken", accessToken, COOKIE_OPTIONS)
        .cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
        .json(new ApiResponse(200, payload, "User logged in"));
});

const logout = asyncHandler(async (req, res) => {
    res.clearCookie("accessToken")
        .clearCookie("refreshToken")
        .json(new ApiResponse(200, {}, "Logout successful"));
});

const verifyEmailSessionId = asyncHandler(async (req, res) => {
    const { sessionId } = req.params;

    if (!sessionId) throw new ApiError(422, "Session ID is required");

    const doc = await userService.getEmailVerifySessionDoc(sessionId);

    if (!doc) throw new ApiError(400, "Session ID doesn't exist or expired");

    res.json(new ApiResponse(200, { sessionId }, "Valid session ID"));
});

module.exports = {
    register,
    login,
    logout,
    verifyEmailSessionId
};
