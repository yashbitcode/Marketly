const mongoose = require("mongoose");
const crypto = require("node:crypto");
const { generateRandomNumberString } = require("../utils/helpers");

const UserSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: [true, "Fullname is required"],
        min: [3, "Minimum length should be 3"],
    },
    email: {
        type: String,
        lowercase: true,
        required: [true, "Email is required"],
        trim: true,
        match: [
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            "Invalid email",
        ],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    role: {
        type: String,
        enum: {
            values: ["user", "vendor"],
            message: "`{VALUE}` is not valid value",
        },
        default: "user",
    },
    avatar: {
        type: String,
        match: [
            /^(https?:\/\/)?[da-z.-]+.([a-z.]{2,6})([\/w .-]*)*\/?$/,
            "Invalid avatar URL",
        ],
    },
    username: {
        type: String,
        required: [true, "Username is required"],
        min: [3, "Minimum length should be 3"],
        max: [10, "Maximum length can be 10"],
        unique: [true, "Username should be unique"],
        match: [/^[a-zA-Z][a-zA-Z0-9_]{2,15}$/, "Invalid username"],
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    emailVerificationToken: String,
    emailVerificationSessionId: String,
    emailVerificationTokenExpiry: Date,

    forgotPasswordSessionId: String,
    forgotPasswordTokenExpiry: Date,
});

UserSchema.statics.generateTokens = function () {
    const sessionId = crypto.randomBytes(15).toString("hex");
    const hashedSessionId = crypto
        .createHmac("sha256", process.env.HASHED_MAC_SECRET)
        .update(sessionId)
        .digest("hex");
    const token = generateRandomNumberString();
    const expiryDate = new Date(Date.now() + 1000 * 60 * 20);

    return {
        sessionId,
        hashedSessionId,
        token,
        expiryDate,
    };
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
