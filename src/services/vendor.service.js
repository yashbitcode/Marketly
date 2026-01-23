const Vendor = require("../models/vendor.models");
const { getPaginationBasePipeline } = require("../utils/helpers");

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

    async getAll(page = 1) {
        const basePagination = getPaginationBasePipeline(+page);

        const [allVendors] = await Vendor.aggregate(basePagination);

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
