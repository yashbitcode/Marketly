const { asyncHandler } = require("../utils/asyncHandler");
const userService = require("../services/user.service");
const User = require("../models/user.models");
const ApiError = require("../utils/api-error");
const ApiResponse = require("../utils/api-response");
const { COOKIE_OPTIONS } = require("../utils/constants");

const register = asyncHandler(async (req, res) => {
    const user = await userService.createNewUser(req.body);
    res.json(new ApiResponse(201, user, "User registered successfully"));
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

        await user.save({ validateBeforeSave: false });

        return res
            .status(422)
            .json(new ApiResponse(422, payload, "User is not verified"));
    }

    const { accessToken, refreshToken } = user.generateAccessAndRefreshTokens();
    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    res.cookie("accessToken", accessToken, COOKIE_OPTIONS)
        .cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
        .json(new ApiResponse(200, payload, "User logged in"));
});

const logout = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const user = await userService.getUserById(_id);

    user.refreshToken = "";

    await user.save({ validateBeforeSave: false });

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

const verifyEmailCode = asyncHandler(async (req, res) => {
    const { sessionId, code } = req.params;

    if (!sessionId || !code)
        throw new ApiError(422, "Session ID and code is required");

    const user = await userService.getEmailVerifySessionDoc(sessionId, {
        emailVerificationToken: 1,
    });

    if (!user) throw new ApiError(400, "Session ID doesn't exist or expired");
    if (user.emailVerificationToken !== code)
        throw new ApiError(422, "Code is incorrect");

    const updatedUser = await userService.getEmailVerifiedById(user._id);

    res.json(
        new ApiResponse(
            200,
            { _id: updatedUser._id },
            "Email verified successfully",
        ),
    );

    // const { accessToken, refreshToken } =
    //     updatedUser.generateAccessAndRefreshTokens();
    // updatedUser.refreshToken = refreshToken;

    // await updatedUser.save();

    // const payload = {
    //     _id: updatedUser._id,
    //     fullname: updatedUser.fullname,
    //     email: updatedUser.email,
    //     role: updatedUser.role,
    //     avatar: updatedUser.avatar,
    //     isEmailVerified: updatedUser.isEmailVerified,
    // };

    // res.cookie("accessToken", accessToken, COOKIE_OPTIONS)
    //     .cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
    //     .json(new ApiResponse(200, payload, "User logged in"));
});

const changePassword = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { oldPassword, newPassword } = req.body;

    const user = await userService.getUserById(_id);
    const isPasswordCorrect = await user.verifyPassword(oldPassword);

    if (!isPasswordCorrect)
        throw new ApiError(400, "Old password is incorrect");

    user.password = newPassword;

    await user.save();

    res.json(new ApiResponse(200, { _id }, "Password changed successfully"));
});

const forgotPasswordLink = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await userService.getUserByEmail(email);

    if (!user) throw new ApiError(400, "User doesn't exist");

    const {
        sessionId: resetToken,
        hashedSessionId: hashedResetToken,
        expiryDate,
    } = User.generateTokens();

    user.forgotPasswordResetToken = hashedResetToken;
    user.forgotPasswordTokenExpiry = expiryDate;

    await user.save();

    res.json(
        new ApiResponse(
            200,
            { resetToken },
            "Forgot password link sent successfully",
        ),
    );
});

const forgotPasswordVerification = asyncHandler(async (req, res) => {
    const { resetToken } = req.params;

    const user = userService.getResetPasswordDoc(resetToken);

    if (!user) throw new ApiError(400, "Reset token doesn't exist or expired");

    res.json(new ApiResponse(200, {}, "Valid reset token"));
});

const resetPassword = asyncHandler(async (req, res) => {
    const { resetToken } = req.params;
    const { newPassword } = req.body;

    const user = userService.getResetPasswordDoc(resetToken);
    if (!user) throw new ApiError(400, "Reset token doesn't exist or expired");

    user.password = newPassword;

    await user.save();

    res.json(new ApiResponse(200, {}, "Password reset successful"));
});

module.exports = {
    register,
    login,
    logout,
    verifyEmailSessionId,
    verifyEmailCode,
    changePassword,
    forgotPasswordLink,
    forgotPasswordVerification,
    resetPassword,
};
