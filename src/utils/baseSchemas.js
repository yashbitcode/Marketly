const {
    REGEX,
    VENDOR_TYPE,
    ACCOUNT_STATUS,
    ATTRIBUTE_DATATYPES,
    ATTRIBUTE_SCHEMA_TYPES,
} = require("./constants");
const mongoose = require("mongoose");

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

const productAttributeSchema = {
    name: {
        type: String,
        required: [true, "Attribute name is required"],
    },
    dataType: {
        type: String,
        enum: {
            values: ATTRIBUTE_DATATYPES,
            message: "`{VALUE}` is not a valid value",
        },
        required: [true, "Attribute datatype is required"],
    },
    isVariant: {
        type: Boolean,
        required: [true, "Variant flag is required"],
    },
    value: {
        type: mongoose.Schema.Types.Union,
        of: ATTRIBUTE_SCHEMA_TYPES,
        required: [true, "Attribute value/values are required"],
        validate: {
            validator: function (value) {
                const { dataType, isVariant } = this;

                if (
                    !(isVariant === Array.isArray(value)) ||
                    !(!isVariant === !Array.isArray(value))
                )
                    return false;

                const types = isVariant ? value : [value];

                return types.every((el) => typeof el === dataType);
            },
            message: "Invalid value with respect to datatype/isVariant",
        },
    },
};

module.exports = {
    baseVendorSchema,
    productAttributeSchema,
};
