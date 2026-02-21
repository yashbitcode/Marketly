import User from "../models/user.models.js";
import ApiError from "../utils/api-error.js";
import { GENERAL_USER_FIELDS } from "../../../shared/constants.js";
import { getPaginationBasePipeline } from "../utils/helpers.js";

class UserService {
    async createNewUser(userData) {
        try {
            const { fullname, email, password, avatar, username, phoneNumber } =
                userData;
            const { sessionId, hashedSessionId, token, expiryDate } =
                User.generateTokens();

            const user = new User({
                fullname,
                email,
                password,
                avatar,
                username,
                phoneNumber,
                emailVerificationToken: token,
                emailVerificationSessionId: hashedSessionId,
                emailVerificationTokenExpiry: expiryDate,
            });

            await user.save();

            return {
                user: {
                    _id: user._id,
                    fullname: user.fullname,
                    email: user.email,
                    username: user.username,
                    sessionId,
                },
                verificationToken: token,
            };
        } catch (error) {
            throw new ApiError(400, error.message);
        }
    }

    async getAll(page = 1) {
        const basePagination = getPaginationBasePipeline(+page);

        const [allUsers] = await User.aggregate([
            {
                $project: GENERAL_USER_FIELDS,
            },
            ...basePagination,
        ]);

        return allUsers;
    }

    async getUserByEmail(email, fieldsSelection = {}) {
        const user = await User.findOne({ email }).select(fieldsSelection);

        return user;
    }

    async getUserById(_id, fieldsSelection = {}) {
        const user = await User.findById(_id).select(fieldsSelection);

        return user;
    }

    async getUserWithVendor(filter, fieldsSelection = {}) {
        const user = await User.findOne(filter)
            .populate("vendorId")
            .select(fieldsSelection);

        return user;
    }

    async getEmailVerifySessionDoc(sessionId, fieldsSelection = {}) {
        const hashedSessionId = createHash(
            sessionId,
            process.env.HASHED_MAC_SECRET,
        );

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

    async getResetPasswordDoc(resetToken, fieldsSelection = {}) {
        const hashedResetToken = createHash(
            resetToken,
            process.env.HASHED_MAC_SECRET,
        );

        const user = await User.findOne({
            forgotPasswordResetToken: hashedResetToken,
            forgotPasswordTokenExpiry: {
                $gt: new Date(),
            },
        }).select(fieldsSelection);

        return user;
    }

    async updateUserData(filters = {}, payload = {}, fieldsSelection = {}) {
        const user = await User.findOneAndUpdate(filters, payload, {
            new: true,
            runValidators: true,
        }).select(fieldsSelection);

        return user;
    }
}

export default new UserService();
