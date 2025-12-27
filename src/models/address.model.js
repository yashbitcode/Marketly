const mongoose = require("mongoose");
const User = require("./user.models");

const addressSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: User,
        },
        fullname: {
            type: String,
            required: [true, "Fullname is required"],
            min: [3, "Minimum length should be 3"],
        },
        phoneNumber: {
            type: String,
            required: [true, "Phone number is required"],
            match: [/^\+[1-9]\d{1,14}$/, "Invalid phone number"],
        },
        addressLine1: {
            type: String,
            required: [true, "Address line is required"],
            min: [10, "Minimum length should be 10"],
        },
        addressLine2: {
            type: String,
            min: [10, "Minimum length should be 10"],
        },
        city: {
            type: String,
            required: [true, "City is required"],
        },
        state: {
            type: String,
            required: [true, "State is required"],
        },
        postalCode: {
            type: String,
            required: [true, "Postal code is required"],
        },
        country: {
            type: String,
            required: [true, "Country is required"],
        },
        addressType: {
            type: String,
            enum: {
                values: ["home", "work", "other"],
                message: "`{VALUE}` is not valid value",
            },
            default: "home",
        },
        isDefault: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

addressSchema.pre("save", function () {
    if (this.isModified("userId"))
        this.userId = new mongoose.Types.ObjectId(this.userId);
});

const Address = mongoose.model("addresses", addressSchema);

module.exports = Address;
