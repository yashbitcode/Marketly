const mongoose = require("mongoose");
const SubCategory = require("./subCategory.models");
const Vendor = require("./vendor.models");
const {
    PRODUCT_APPROVAL_STATUS,
    ATTRIBUTE_SCHEMA_TYPES,
    ATTRIBUTE_DATATYPES,
} = require("../utils/constants");
const { generateUniqueSlug } = require("../utils/helpers");
const { productAttributeSchema } = require("../utils/baseSchemas");

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Product name is required"],
        min: [3, "Minimum length should be 3"],
    },
    slug: {
        type: String,
        required: [true, "Slug is required"],
        unique: [true, "Slug should be unique"],
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        validate: {
            validator: function (price) {
                return price > 0;
            },
            message: "Invalid price"
        },
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: SubCategory,
        required: [true, "Category ID is required"],
    },
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Vendor,
        required: [true, "Vendor ID is required"],
    },
    brandName: {
        type: String,
        required: [true, "Brand name is required"],
        min: [3, "Minimum length should be 3"],
    },
    currency: {
        type: String,
        default: "₹",
    },
    approval: {
        status: {
            type: String,
            enum: {
                values: PRODUCT_APPROVAL_STATUS,
                message: "`{VALUE}` is not a valid value",
            },
            default: "pending",
        },
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        min: [20, "Minimum length should be 3"],
    },
    pros: {
        type: [String],
        required: [true, "Pros are required"],
        validate: {
            validator: function (pros) {
                return pros.length > 0;
            },
            message: "Atleast 1 pros should be there",
        },
    },
    cons: {
        type: [String],
        required: [true, "Cons are required"],
        validate: {
            validator: function (cons) {
                return cons.length > 0;
            },
            message: "Atleast 1 cons should be there",
        },
    },
    keyFeatures: {
        type: [String],
        required: [true, "Key features are required"],
        validate: {
            validator: function (features) {
                return features.length > 0;
            },
            message: "Atleast 1 key feature should be there",
        },
    },
    images: {
        type: [String],
        required: [true, "images are required"],
        validate: {
            validator: function (images) {
                return images.length > 0;
            },
            message: "Atleast 1 image should be there",
        },
    },
    stockQuantity: {
        type: Number,
        required: [true, "Quantity is required"],
        min: [0, "Quantity can't be negative"],
    },
    attributes: {
        type: [productAttributeSchema],
        validate: {
            validator: function (attribute) {
                return attribute.length > 0;
            },
            message: "Atleast 1 attribute should be there",
        },
        default: undefined   
    }
});

ProductSchema.pre("validate", function () {
    if (this.isModified("name")) this.slug = generateUniqueSlug(this.name);
});

ProductSchema.pre("findOneAndUpdate", function (next) {
    const update = this.getUpdate();

    if (!update.name) next();

    update.slug = generateUniqueSlug(update.name);

    this.setUpdate(update);
});

const Product = mongoose.model("products", ProductSchema);

module.exports = Product;
