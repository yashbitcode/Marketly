import {
    REGEX,
    VENDOR_TYPE,
    ACCOUNT_STATUS,
    ATTRIBUTE_DATATYPES,
    ATTRIBUTE_SCHEMA_TYPES,
} from "../../../shared/constants.js";
import mongoose from "mongoose";

const mediaSchema = {
    fileId: {
        type: String,
        required: [true, "File ID is required"],
    },
    url: {
        type: String,
        match: [REGEX.url, "Invalid URL"],
        required: [true, "URL is required"],
    },
    thumbnailUrl: {
        type: String,
        match: [REGEX.url, "Invalid thumbnail URL"],
        required: [true, "Thumbnail URL is required"],
    },
    filename: {
        type: String,
        required: [true, "Filename is required"],
    },
};

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
        type: new mongoose.Schema(mediaSchema, { _id: false }),
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
                const chk = types.every(
                    (el) =>
                        typeof el ===
                        (dataType === "text" ? "string" : dataType),
                );

                if (!chk || (isVariant && value.length === 0)) return false;
            },
            message: "Invalid value with respect to datatype/isVariant",
        },
    },
};

const productItemSchema = {
    slug: {
        type: String,
        required: [true, "Slug is required"],
    },
    quantity: {
        type: Number,
        required: [true, "Quantity is required"],
        min: [1, "Minimum 1 quantity is required"],
    },
};

const prefillsSchema = {
    name: {
        type: String,
        required: [true, "Name is required"],
        min: [3, "Minimum length should be 3"],
    },
    email: {
        type: String,
        lowercase: true,
        required: [true, "Email is required"],
        trim: true,
        match: [REGEX.email, "Invalid email"],
        trim: true,
    },
    phoneNumber: {
        type: String,
        required: [true, "Phone number is required"],
        match: [REGEX.phoneNumber, "Invalid phone number"],
    },
};

const notesSchema = {
    description: {
        type: String,
        min: [10, "Minimum length should be 10"],
    },
};

const sellerOrderProductsSchema = {
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: [true, "Product is required"],
    },
    quantity: {
        type: Number,
        required: [true, "Quantity is required"],
        min: [1, "Minimum 1 quantity is required"],
    },
};

export {
    prefillsSchema,
    notesSchema,
    baseVendorSchema,
    productAttributeSchema,
    mediaSchema,
    productItemSchema,
    sellerOrderProductsSchema,
};
