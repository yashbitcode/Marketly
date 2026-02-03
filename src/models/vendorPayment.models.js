const mongoose = require("mongoose");

const VendorPaymentSchema = mongoose.Schema({
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Vendor ID is required"]
    },
    sellerOrder: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Seller order ID is required"]
    },
    amount: {
        type: Number,
        required: [true, "Amount is required"],
        min: [1, "Amount cannot be less than 1"]
    },
    isPaid: {
        type: Boolean,
        default: false
    }
})

const VendorPayment = mongoose.model("vendor-payments", VendorPaymentSchema);

module.exports = VendorPayment;