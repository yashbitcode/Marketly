const VendorPayout = require("../models/vendorPayout.models");
const { GENERAL_USER_FIELDS, VENDOR_TYPE } = require("../utils/constants");
const {
    getPaginationBasePipeline,
    getVendorPayoutFilterationPipeline,
} = require("../utils/helpers");

class VendorPayoutService {
    async createVendorPayout(payload) {
        const { vendor, sellerOrder, amount } = payload;

        const vendorPayout = new VendorPayout({ vendor, sellerOrder, amount });

        await vendorPayout.save();

        return vendorPayout;
    }

    async createBulkVendorPayouts(payload) {
        const vendorPayouts = await VendorPayout.insertMany(payload);

        return vendorPayouts;
    }

    async getSpecific(filters = {}) {
        const vendorPayout = await VendorPayout.findOne(filters)
            .populate({
                path: "vendor",
            })
            .populate({
                path: "sellerOrder",
                populate: [
                    {
                        path: "user",
                        select: Object.keys(GENERAL_USER_FIELDS).join(" "),
                    },
                    { path: "orderDocId" },
                    {
                        path: "products.product",
                        populate: {
                            path: "category",
                            populate: {
                                path: "parentCategory",
                            },
                        },
                    },
                ],
            });

        return vendorPayout;
    }

    /*
    s - 6962681017186c3b28b5b17d, v - 6953cd93456f0bcb6a034329
    products -> 69574b6719823146e1604c3e 69574b6f19823146e1604c42 69574b7419823146e1604c46
*/
    async getAll(filterQueries = {}, page = 1) {
        const basePagination = getPaginationBasePipeline(+page);
        const baseFilterPipeline =
            getVendorPayoutFilterationPipeline(filterQueries);

        const [allVendorPayouts] = await VendorPayout.aggregate([
            ...baseFilterPipeline,
            {
                $lookup: {
                    from: "vendors",
                    localField: "vendor",
                    foreignField: "_id",
                    as: "vendor",
                },
            },
            {
                $addFields: {
                    vendor: { $arrayElemAt: ["$vendor", 0] },
                },
            },
            ...basePagination,
        ]);

        return allVendorPayouts;
    }

    async getSpecificForAmount(id) {
        const vendorPayout = await VendorPayout.findById(id).populate({
            path: "vendor",
        });

        return vendorPayout;
    }

    async updateVendorPayout(id, payload) {
        const vendorPayout = await VendorPayout.findByIdAndUpdate(id, payload, {
            new: true,
        });

        return vendorPayout;
    }
}

module.exports = new VendorPayoutService();
