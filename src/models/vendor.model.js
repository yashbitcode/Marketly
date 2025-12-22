const mongoose = require("mongoose");
const User = require("./user.models");

const VendorSchema = new mongoose.Schema({
    userRefId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    },
    vendorType: {
        type: String,
        enum: {
            values: ["individual", "business"],
            message: "`{VALUE}` is not valid value"
        },
        default: "individual"
    },
    avatar: {
        type: String,
        match: [
            /^(https?:\/\/)?[da-z.-]+.([a-z.]{2,6})([\/w .-]*)*\/?$/,
            "Invalid avatar URL"
        ]
    },
    storeName: {
        type: String,
        required: [true, "Store name is required"],
        min: [3, "Minimum length should be 3"],
        max: [20, "Maximum length can be 20"]
    },
    fullname: {
        type: String,
        required: [true, "Fullname is required"],
        min: [3, "Minimum length should be 3"]
    },
    accountStatus: {
        type: String,
        enum: {
            values: ["pending", "active", "suspended", "banned"],
            message: "`{VALUE}` is not valid value"
        },
    },
    phoneNumber: {
        type: String,
        required: [true, "Phone number is required"],
        match: [/^(\+\d{1,2}\s?)?1?[-.\s]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, "Invalid phone number"]
    }
});

const Vendor = mongoose.model("vendors", VendorSchema);

module.exports = Vendor;