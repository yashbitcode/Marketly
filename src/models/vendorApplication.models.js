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
    applicationStatus: VENDOR_APPLICATION_STATUS,
    remarks: String,
});

const VendorApplication = mongoose.model(
    "vendor_applications",
    vendorApplicationSchema,
);

module.exports = VendorApplication;
