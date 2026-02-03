const vendorPayoutService = require("../services/vendorPayout.service");
const ApiResponse = require("../utils/api-response");
const { asyncHandler } = require("../utils/asyncHandler");

const getAllVendorPayouts = asyncHandler(async (req, res) => {
    const { data, totalCount } = await vendorPayoutService.getAll();

    res.json(
        new ApiResponse(
            200,
            { vendorPayouts: data, totalCount },
            "Vendor payouts fetched successfully",
        ),
    );
});

const getSpecificVendorPayout = asyncHandler(async (req, res) => {
    const { vendorPayoutId } = req.params;
    
    const vendorPayout = await vendorPayoutService.getSpecific({
        _id: vendorPayoutId
    });

    res.json(
        new ApiResponse(
            200,
            vendorPayout,
            "Vendor payout fetched successfully",
        ),
    );
});

module.exports = {
    getAllVendorPayouts,
    getSpecificVendorPayout,
};
