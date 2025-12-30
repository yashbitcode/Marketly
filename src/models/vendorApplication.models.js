const mongoose = require("mongoose");
const { baseVendorSchema } = require("../utils/baseSchemas");
const { VENDOR_APPLICATION_STATUS } = require("../utils/constants");
const User = require("./user.models");
const Vendor = require("./vendor.models");

const vendorApplicationSchema = new mongoose.Schema({
    ...baseVendorSchema,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
    },
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Vendor,
    },
    description: {
        type: String,
        min: [10, "Minimum length should be 10"],
    },
    applicationStatus: {
        type: String,
        enum: {
            values: VENDOR_APPLICATION_STATUS,
            message: "`{VALUE}` is not valid value",
        },
        default: "pending",
    },
    remarks: {
        type: String,
        min: [10, "Minimum length should be 10"],
    },
}, {
    timestamps: true
});

const VendorApplication = mongoose.model(
    "vendor-applications",
    vendorApplicationSchema,
);

module.exports = VendorApplication;
