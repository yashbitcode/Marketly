const mongoose = require("mongoose");
const Vendor = require("./vendor.models");
const SellerOrder = require("./sellerOrder.models");
const Order = require("./order.models");

const VendorPayoutSchema = mongoose.Schema({
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Vendor,
        required: [true, "Vendor ID is required"],
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Order,
        required: [true, "Seller order ID is required"],
    },
    sellerOrder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: SellerOrder,
        required: [true, "Seller order ID is required"],
    },
    amount: {
        type: Number,
        required: [true, "Amount is required"],
        min: [1, "Amount cannot be less than 1"],
    },
    transferId: {
        type: String,
    },
    payoutId: {
        type: String,
    },
    isPaid: {
        type: Boolean,
        default: false,
    },
});

const VendorPayout = mongoose.model("vendor-payouts", VendorPayoutSchema);

module.exports = VendorPayout;
