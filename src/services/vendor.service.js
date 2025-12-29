const Vendor = require("../models/vendor.model");
const ApiError = require("../utils/api-error");

class VendorService {
    async insertVendor(payload) {
        const {
            userRefId,
            vendorType,
            avatar,
            storeName,
            fullname,
            accountStatus,
            phoneNumber,
        } = payload;

        const vendor = new Vendor({
            userRefId,
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

    async getVendorById(
        vendorId,
        vendorFieldsSelection = {},
    ) {
        const vendor = await Vendor.findById(vendorId)
            .select(vendorFieldsSelection);

        return vendor;
    }

    async updateVendorDetails(
        vendorId,
        payload,
        vendorFieldsSelection = {},
    ) {
        const vendor = await Vendor.findOneAndUpdate(
            { _id: vendorId },
            payload,
            { new: true, runValidators: true },
        )
            .select(vendorFieldsSelection);

        return vendor;
    }
}

module.exports = new VendorService();
