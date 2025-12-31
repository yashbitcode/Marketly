const mongoose = require("mongoose");
const { baseVendorSchema } = require("../utils/baseSchemas");

const VendorSchema = new mongoose.Schema(
    {
        ...baseVendorSchema,

            metrics: {
                avgCustomerRating: {
                    type: Number,
                    default: 0,
                },
                totalOrders: {
                    type: Number,
                    default: 0,
                },
                fulfilledOrders: {
                    type: Number,
                    default: 0,
                },
                rejectedOrders: {
                    type: Number,
                    default: 0,
                },
            },
    },
    {
        timestamps: true,
    },
);

// VendorSchema.methods.generateAccessAndRefreshTokens = function () {
//     const payload = { iat: Date.now(), _id: this._id, role: "vendor" };

//     return generateBaseTokens(payload);
// };

const Vendor = mongoose.model("vendors", VendorSchema);

module.exports = Vendor;
