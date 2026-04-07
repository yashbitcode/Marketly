import { asyncHandler } from "../utils/asyncHandler.js";
import userService from "../services/user.service.js";
import User from "../models/user.models.js";
import ApiError from "../utils/api-error.js";
import ApiResponse from "../utils/api-response.js";
import {
    COOKIE_OPTIONS,
} from "shared/constants.js";
import superAdminService from "../services/superAdmin.service.js";
import {
    registrationCodeMailContent,
    passwordResetMailContent,
    registrationMailContent,
    passwordChangedMailContent,
} from "../utils/mail.js";
import { pubClient as redisClient } from "../config/redis/connection.js";
import { createHash } from "../utils/helpers.js";
import { inngest } from "../inngest/index.js";

const register = asyncHandler(async (req, res, next) => {
    const { user, verificationToken, hashedSessionId } =
        await userService.createNewUser(req.body);

    if (!user) throw new ApiError();

    const emailData = {
        emailContent: registrationCodeMailContent(
            user.fullname,
            verificationToken,
        ),
        from: process.env.MARKETLY_EMAIL,
        to: user.email,
        subject: "Verify Your Account",
    };

    // await emailQueue.add("send-email", emailData, {
    //     removeOnComplete: true,
    //     removeOnFail: true,
    //     attempts: 3,
    // });

    await inngest
        .send({
            name: "mail/send-mail",
            data: emailData,
        })
        .catch((err) => next(err));

    await redisClient.set(
        `emailVerificationSession:${hashedSessionId}`,
        JSON.stringify({
            userId: user._id,
            token: verificationToken,
        }),
    );

    await redisClient.expire(
        `emailVerificationSession:${hashedSessionId}`,
        60 * 20,
    );
    res.json(new ApiResponse(201, user, "User registered successfully"));
});

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await userService.getUserByEmail(email);

    console.log(user)

    if (!user) throw new ApiError(400, "Invalid credentials");

    const isPasswordCorrect = await user.verifyPassword(password);

    if (!isPasswordCorrect) throw new ApiError(400, "Invalid credentials");

    const payload = {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        username: user.username,
        phoneNumber: user.phoneNumber,
        role: user.role,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified,
        tokenVersion: user.tokenVersion,
        currentRole: "user"
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

        await redisClient.set(
            `emailVerificationSession:${hashedSessionId}`,
            JSON.stringify({
                userId: user._id,
                token,
            }),
        );

        await redisClient.expire(
            `emailVerificationSession:${hashedSessionId}`,
            60 * 20,
        );

        return res
            .status(422)
            .json(new ApiResponse(422, payload, "User is not verified"));
    }

    const { accessToken, refreshToken } =
        user.generateAccessAndRefreshTokens("user");
    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    await redisClient.set(`user:${user._id}`, JSON.stringify(payload));
    await redisClient.expire(`user:${user._id}`, 60 * 60 * 24);

    res.cookie("accessToken", accessToken, COOKIE_OPTIONS)
        .cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
        .json(new ApiResponse(200, payload, "User logged in"));
});

const logout = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const user = await userService.getUserById(_id);

    console.log(user);

    user.refreshToken = "";

    await user.save({ validateBeforeSave: false });

    let redisKey =
        req.user.currentRole === "vendor"
            ? `vendor:${user.vendorId._id}`
            : `user:${_id}`;
    await redisClient.del(redisKey);

    res.clearCookie("accessToken", COOKIE_OPTIONS)
        .clearCookie("refreshToken", COOKIE_OPTIONS)
        .json(new ApiResponse(200, {}, "Logout successful"));
});

const loginVendor = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const vendorUser = await userService.getUserWithVendor({ email });

    if (!vendorUser || !vendorUser?.vendorId?._id) throw new ApiError(400, "Invalid credentials");

    const isPasswordCorrect = await vendorUser.verifyPassword(password);

    if (!isPasswordCorrect) throw new ApiError(400, "Invalid credentials");

    const { accessToken, refreshToken } =
        vendorUser.generateAccessAndRefreshTokens("vendor");
    vendorUser.refreshToken = refreshToken;

    await vendorUser.save({ validateBeforeSave: false });

    const payload = {
        _id: vendorUser._id,
        fullname: vendorUser.fullname,
        email: vendorUser.email,
        username: vendorUser.username,
        phoneNumber: vendorUser.phoneNumber,
        role: vendorUser.role,
        avatar: vendorUser.avatar,
        isEmailVerified: vendorUser.isEmailVerified,
        tokenVersion: vendorUser.tokenVersion,
        vendorId: vendorUser.vendorId,
        currentRole: "vendor"
    };

    await redisClient.set(
        `vendor:${vendorUser.vendorId._id}`,
        JSON.stringify(payload),
    );
    await redisClient.expire(`vendor:${vendorUser.vendorId._id}`, 60 * 60 * 24);

    res.cookie("accessToken", accessToken, COOKIE_OPTIONS)
        .cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
        .json(new ApiResponse(200, payload, "Vendor logged in"));
});

const loginSuperAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    let superAdmin = await superAdminService.getSuperAdmin({ email });

    if (superAdmin) {
        const isPasswordCorrect = await superAdmin.verifyPassword(password);
        if (!isPasswordCorrect) throw new ApiError(401, "Invalid credentials");
    } else {
        const isValid = await superAdminService.verifyLoginDetails(
            email,
            password,
        );

        if (!isValid) throw new ApiError(401, "Invalid credentials");

        superAdmin = await superAdminService.createSuperAdmin({
            email,
            password,
        });
        await superAdmin.save();
    }

    const payload = {
        _id: superAdmin._id,
        fullname: superAdmin.fullname,
        email: superAdmin.email,
        username: superAdmin.username,
        phoneNumber: superAdmin.phoneNumber,
        role: superAdmin.role,
        avatar: superAdmin.avatar,
        isEmailVerified: superAdmin.isEmailVerified,
        tokenVersion: superAdmin.tokenVersion,
        currentRole: "super-admin"
    };

    const { accessToken, refreshToken } =
        superAdmin.generateAccessAndRefreshTokens("super-admin");

    await redisClient.set(`user:${superAdmin._id}`, JSON.stringify(payload));
    await redisClient.expire(`user:${superAdmin._id}`, 60 * 60 * 24);

    res.cookie("accessToken", accessToken, COOKIE_OPTIONS)
        .cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
        .json(new ApiResponse(200, payload, "Super admin logged in"));
});

const verifyEmailSessionId = asyncHandler(async (req, res) => {
    const { sessionId } = req.params;

    const sessionIdHash = createHash(sessionId, process.env.HASHED_MAC_SECRET);

    const sessionCache = await redisClient.get(
        `emailVerificationSession:${sessionIdHash}`,
    );

    if (!sessionCache)
        throw new ApiError(400, "Session ID doesn't exist or expired");

    res.json(new ApiResponse(200, { sessionId }, "Valid session ID"));

    // if (!sessionId) throw new ApiError(422, "Session ID is required");

    // const doc = await userService.getEmailVerifySessionDoc(sessionId);

    // if (!doc) throw new ApiError(400, "Session ID doesn't exist or expired");

    // res.json(new ApiResponse(200, { sessionId }, "Valid session ID"));
});

const verifyEmailCode = asyncHandler(async (req, res, next) => {
    const { sessionId, code } = req.params;

    if (!sessionId || !code)
        throw new ApiError(422, "Session ID and code is required");

    const sessionIdHash = createHash(sessionId, process.env.HASHED_MAC_SECRET);

    const sessionCache = JSON.parse(
        await redisClient.get(`emailVerificationSession:${sessionIdHash}`),
    );

    // const user = await userService.getEmailVerifySessionDoc(sessionId, {
    //     emailVerificationToken: 1,
    //     email: 1,
    // });

    if (!sessionCache)
        throw new ApiError(400, "Session ID doesn't exist or expired");

    if (sessionCache.token !== code)
        throw new ApiError(422, "Code is incorrect");

    const updatedUser = await userService.getEmailVerifiedById(
        sessionCache.userId,
    );

    const emailData = {
        emailContent: registrationMailContent(
            updatedUser.fullname,
            process.env.FRONTEND_URL,
        ),
        from: process.env.MARKETLY_EMAIL,
        to: updatedUser.email,
        subject: "Account Created Login Now",
    };

    await redisClient.del(`emailVerificationSession:${sessionIdHash}`);

    // await emailQueue.add("send-email", emailData, {
    //     removeOnComplete: true,
    //     removeOnFail: true,
    //     attempts: 3,
    // });

    await inngest
        .send({
            name: "mail/send-mail",
            data: emailData,
        })
        .catch((err) => next(err));

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

const changePassword = asyncHandler(async (req, res, next) => {
    const { _id } = req.user;
    const { oldPassword, newPassword } = req.body;

    const user = await userService.getUserById(_id);
    const isPasswordCorrect = await user.verifyPassword(oldPassword);

    if (!isPasswordCorrect)
        throw new ApiError(400, "Old password is incorrect");

    user.password = newPassword;

    await user.save();

    const emailData = {
        emailContent: passwordChangedMailContent(user.fullname),
        from: process.env.MARKETLY_EMAIL,
        to: user.email,
        subject: "Password Changed Successfully",
    };

    // await emailQueue.add("send-email", emailData, {
    //     removeOnComplete: true,
    //     removeOnFail: true,
    //     attempts: 3,
    // });

    await inngest
        .send({
            name: "mail/send-mail",
            data: emailData,
        })
        .catch((err) => next(err));

    res.json(new ApiResponse(200, { _id }, "Password changed successfully"));
});

const forgotPasswordLink = asyncHandler(async (req, res, next) => {
    const { email } = req.body;

    const user = await userService.getUserByEmail(email);

    if (!user) throw new ApiError(404, "User not found");

    const {
        sessionId: resetToken,
        hashedSessionId: hashedResetToken,
        expiryDate,
    } = User.generateTokens();

    user.forgotPasswordResetToken = hashedResetToken;
    user.forgotPasswordTokenExpiry = expiryDate;

    await user.save();

    await redisClient.set(
        `forgotPasswordToken:${hashedResetToken}`,
        JSON.stringify({
            userId: user._id,
        }),
    );

    console.log(hashedResetToken);

    await redisClient.expire(
        `forgotPasswordToken:${hashedResetToken}`,
        60 * 20,
    );

    const emailData = {
        emailContent: passwordResetMailContent(
            user.fullname,
            process.env.FRONTEND_URL + `/${resetToken}`,
        ),
        from: process.env.MARKETLY_EMAIL,
        to: user.email,
        subject: "Reset Password",
    };

    // await emailQueue.add("send-email", emailData, {
    //     removeOnComplete: true,
    //     removeOnFail: true,
    //     attempts: 3,
    // });

    await inngest
        .send({
            name: "mail/send-mail",
            data: emailData,
        })
        .catch((err) => next(err));

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
    console.log(resetToken);
    const resetTokenHash = createHash(
        resetToken,
        process.env.HASHED_MAC_SECRET,
    );

    console.log(resetTokenHash);

    const forgotPasswordCache = await redisClient.get(
        `forgotPasswordToken:${resetTokenHash}`,
    );

    // const user = userService.getResetPasswordDoc(resetToken);

    if (!forgotPasswordCache)
        throw new ApiError(400, "Reset token doesn't exist or expired");

    res.json(new ApiResponse(200, {}, "Valid reset token"));
});

const resetPassword = asyncHandler(async (req, res) => {
    const { resetToken } = req.params;
    const { newPassword } = req.body;

    const resetTokenHash = createHash(
        resetToken,
        process.env.HASHED_MAC_SECRET,
    );

    const forgotPasswordCache = JSON.parse(
        await redisClient.get(`forgotPasswordToken:${resetTokenHash}`),
    );

    // const user = userService.getResetPasswordDoc(resetToken);
    if (!forgotPasswordCache)
        throw new ApiError(400, "Reset token doesn't exist or expired");

    await userService.updateUserData(
        { _id: forgotPasswordCache.userId },
        {
            password: newPassword,
            forgotPasswordResetToken: null,
            forgotPasswordTokenExpiry: null,
        },
    );

    await redisClient.del(`forgotPasswordToken:${resetTokenHash}`);

    res.json(new ApiResponse(200, {}, "Password reset successful"));
});

export {
    register,
    login,
    loginVendor,
    loginSuperAdmin,
    logout,
    verifyEmailSessionId,
    verifyEmailCode,
    changePassword,
    forgotPasswordLink,
    forgotPasswordVerification,
    resetPassword,
};
