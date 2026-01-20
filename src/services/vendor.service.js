const Vendor = require("../models/vendor.models");

class VendorService {
    async insertVendor(payload) {
        const {
            vendorType,
            avatar,
            storeName,
            fullname,
            accountStatus,
            phoneNumber,
        } = payload;

        const vendor = new Vendor({
            vendorType,
            avatar,
            storeName,
            fullname,
            accountStatus,
            phoneNumber,
        });

        await vendor.save();

        return vendor;
    }

    async getAll(filters = {}, vendorFieldsSelection = {}) {
        const allVendors = await Vendor.find(filters).select(vendorFieldsSelection);

        return allVendors;
    }

    async getVendorById(vendorId, vendorFieldsSelection = {}) {
        const vendor = await Vendor.findById(vendorId).select(
            vendorFieldsSelection,
        );

        return vendor;
    }

    async updateVendorDetails(vendorId, payload, vendorFieldsSelection = {}) {
        const vendor = await Vendor.findOneAndUpdate(
            { _id: vendorId },
            payload,
            { new: true, runValidators: true },
        ).select(vendorFieldsSelection);

        return vendor;
    }
}

module.exports = new VendorService();
