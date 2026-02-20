import mongoose from "mongoose";
import { baseVendorSchema } from "../utils/baseSchemas.js";
import { VENDOR_APPLICATION_STATUS } from "../utils/constants.js";
import User from "./user.models.js";
import Vendor from "./vendor.models.js";

const vendorApplicationSchema = new mongoose.Schema(
    {
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
    },
    {
        timestamps: true,
    },
);

const VendorApplication = mongoose.model(
    "vendor-applications",
    vendorApplicationSchema,
);

export default VendorApplication;
