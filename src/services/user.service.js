const User = require("../models/user.models");
const ApiError = require("../utils/api-error");
const crypto = require("node:crypto");

class UserService {
    async createNewUser(userData) {
        try {
            const { fullname, email, password, avatar, username } = userData;
            const { sessionId, hashedSessionId, token, expiryDate } =
                User.generateTokens();

            const user = new User({
                fullname,
                email,
                password,
                avatar,
                username,
                emailVerificationToken: token,
                emailVerificationSessionId: hashedSessionId,
                emailVerificationTokenExpiry: expiryDate,
            });

            await user.save();

            return {
                _id: user._id,
                email: user.email,
                username: user.username,
                sessionId,
            };
        } catch (error) {
            throw new ApiError(400, error.message);
        }
    }

    async getUserByEmail(email, fieldsSelection = {}) {
        const user = await User.findOne({ email }).select(fieldsSelection);

        return user;
    }

    async getUserById(_id, fieldsSelection = {}) {
        const user = await User.findById(_id).select(fieldsSelection);

        return user;
    }

    async getEmailVerifySessionDoc(sessionId, fieldsSelection = {}) {
        const hashedSessionId = crypto
            .createHmac("sha256", process.env.HASHED_MAC_SECRET)
            .update(sessionId)
            .digest("hex");

        const user = await User.findOne({
            emailVerificationSessionId: hashedSessionId,
            emailVerificationTokenExpiry: {
                $gt: new Date(),
            },
        }).select(fieldsSelection);

        return user;
    }

    async getEmailVerifiedById(_id, fieldsSelection = {}) {
        const user = await User.findOneAndUpdate(
            { _id },
            {
                isEmailVerified: true,
                emailVerificationSessionId: "",
                emailVerificationToken: "",
                emailVerificationTokenExpiry: null,
            },
        ).select(fieldsSelection);
        
        return user;
    }
}

module.exports = new UserService();
