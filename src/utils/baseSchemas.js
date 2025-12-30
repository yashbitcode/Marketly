const { REGEX, VENDOR_TYPE, ACCOUNT_STATUS } = require("./constants");

const baseVendorSchema = {
    vendorType: {
        type: String,
        enum: {
            values: VENDOR_TYPE,
            message: "`{VALUE}` is not valid value",
        },
        default: "individual",
    },
    avatar: {
        type: String,
        match: [REGEX.url, "Invalid avatar URL"],
    },
    storeName: {
        type: String,
        required: [true, "Store name is required"],
        min: [3, "Minimum length should be 3"],
        max: [20, "Maximum length can be 20"],
    },
    fullname: {
        type: String,
        required: [true, "Fullname is required"],
        min: [3, "Minimum length should be 3"],
    },
    accountStatus: {
        type: String,
        enum: {
            values: ACCOUNT_STATUS,
            message: "`{VALUE}` is not valid value",
        },
    },
    phoneNumber: {
        type: String,
        required: [true, "Phone number is required"],
        match: [REGEX.phoneNumber, "Invalid phone number"],
    },
};

module.exports = {
    baseVendorSchema
};