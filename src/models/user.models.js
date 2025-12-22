const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: [true, "Fullname is required"],
        min: [3, "Minimum length should be 3"]
    },
    email: {
        type: String,
        lowercase: true,
        required: [true, "Email is required"],
        trim: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email"]
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    role: {
        type: String,
        enum: {
            values: ["user", "vendor", "super-admin"],
            message: "`{VALUE}` is not valid value"
        },
        default: "user"
    },
    avatar: {
        type: String,
        match: [
            /^(https?:\/\/)?[da-z.-]+.([a-z.]{2,6})([\/w .-]*)*\/?$/,
            "Invalid avatar URL"
        ]
    },
    username: {
        type: String,
        required: [true, "Username is required"],
        min: [3, "Minimum length should be 3"],
        max: [10, "Maximum length can be 10"],
        unique: [true, "Username should be unique"],
        match: [/^[a-zA-Z][a-zA-Z0-9_]{2,15}$/, "Invalid username"]
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationToken: String,
    emailVerificationTokenExpiry: Date,
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date
});

const User = mongoose.model("users", UserSchema);

module.export = User;