const mongoose = require("mongoose");
const crypto = require("node:crypto");
const bcrypt = require("bcrypt");
const {
    generateRandomNumberString,
    generateBaseTokens,
} = require("../utils/helpers");
const { REGEX, ROLES } = require("../utils/constants");
const Vendor = require("./vendor.models");

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
            match: [REGEX.email, "Invalid email"],
            unique: [true, "Email already exists"],
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        role: {
            type: String,
            enum: {
                values: ROLES,
                message: "`{VALUE}` is not a valid value",
            },
            default: "user",
        },
        avatar: {
            type: String,
            match: [REGEX.url, "Invalid avatar URL"],
            default: "",
        },
        username: {
            type: String,
            required: [true, "Username is required"],
            min: [3, "Minimum length should be 3"],
            max: [10, "Maximum length can be 10"],
            unique: [true, "Username already exists"],
            trim: true,
            match: [REGEX.username, "Invalid username"],
        },
        phoneNumber: {
            type: String,
            required: [true, "Phone number is required"],
            match: [REGEX.phoneNumber, "Invalid phone number"],
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        refreshToken: String,
        tokenVersion: {
            type: Number,
            default: 0,
        },
        
        vendorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: Vendor
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

UserSchema.methods.generateAccessAndRefreshTokens = function (currentRole) {
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
        currentRole,
    };

    if(currentRole === "vendor") payload.vendorId = this.vendorId._id;

    return generateBaseTokens(payload);
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
