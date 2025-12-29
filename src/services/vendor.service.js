const Vendor = require("../models/vendor.model");

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
        userFieldsSelection = {},
    ) {
        const vendor = await Vendor.findById(vendorId)
            .populate("userRefId", userFieldsSelection)
            .select(vendorFieldsSelection);

        return vendor;
    }

    async updateVendorDetails(
        vendorId,
        payload,
        vendorFieldsSelection = {},
        userFieldsSelection = {},
    ) {
        const vendor = await Vendor.findOneAndUpdate({_id: vendorId}, payload, {new: true, runValidators: true})
            .populate("userRefId", userFieldsSelection)
            .select(vendorFieldsSelection);
        
        return vendor;
    }
}

module.exports = new VendorService();
