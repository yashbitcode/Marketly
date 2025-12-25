const mongoose = require("mongoose");
const crypto = require("node:crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateRandomNumberString } = require("../utils/helpers");

const UserSchema = new mongoose.Schema(
    {
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
            unique: [true, "Email already exists"],
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
            default: "",
        },
        username: {
            type: String,
            required: [true, "Username is required"],
            min: [3, "Minimum length should be 3"],
            max: [10, "Maximum length can be 10"],
            unique: [true, "Username already exists"],
            match: [/^[a-zA-Z][a-zA-Z0-9_]{2,15}$/, "Invalid username"],
        },
        phoneNumber: {
            type: String,
            required: [true, "Phone number is required"],
            match: [
                /^\+[1-9]\d{1,14}$/,
                "Invalid phone number",
            ],
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        refreshToken: String,
        tokenVersion: {
            type: Number,
            default: 0
        },

        emailVerificationToken: String,
        emailVerificationSessionId: String,
        emailVerificationTokenExpiry: Date,

        forgotPasswordResetToken: String,
        forgotPasswordTokenExpiry: Date,
    },
    {
        timestamps: true,
    },
);

UserSchema.pre("save", async function () {
    if (this.isModified("password"))
        this.password = await bcrypt.hash(
            this.password,
            +process.env.SALT_ROUNDS,
        );
});

UserSchema.methods.generateAccessAndRefreshTokens = function () {
    const payload = {
        iat: Date.now(),
        _id: this._id,
        // fullname: this.fullname,
        // username: this.username,
        // email: this.email,
        // avatar: this.avatar,
        // phoneNumber: this.phoneNumber,
        // isEmailVerified: this.isEmailVerified,
        tokenVersion: this.tokenVersion,
        role: this.role,
    };

    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    });

    return {
        accessToken,
        refreshToken,
    };
};

UserSchema.methods.verifyPassword = async function (password) {
    const result = await bcrypt.compare(password, this.password);

    return result;
};

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
