const VendorPayment = require("../models/vendorPayment.models");

class VendorPaymentService {
    async createVendorPayment(payload) {
        const {vendor, sellerOrder, amount} = payload;

        const vendorPayment = new VendorPayment({vendor, sellerOrder, amount});

        await vendorPayment.save();

        return vendorPayment;
    }

    async createBulkVendorPayments(payload) {
        const vendorPayments = await VendorPayment.insertMany(payload);

        return vendorPayments;
    }

    async updateVendorPaymentStatus(id) {
        const vendorPayment = await VendorPayment.findByIdAndUpdate(id, {isPaid: true}, {
            new: true
        });

        return vendorPayment;
    }
};

module.exports = new VendorPaymentService();