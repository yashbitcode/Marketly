const vendorService = require("../services/vendor.service");
const ApiError = require("../utils/api-error");
const ApiResponse = require("../utils/api-response");
const { asyncHandler } = require("../utils/asyncHandler");
const { ACCOUNT_STATUS, GENERAL_USER_FIELDS } = require("../utils/constants");

const createVendor = asyncHandler(async (req, res) => {
    const vendor = await vendorService.insertVendor(req.body);

    if (!vendor) throw new ApiError();

    res.json(new ApiResponse(201, vendor, "Vendor created successfully"));
});

const updateVendor = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const updatedVendor = await vendorService.updateVendorDetails(
        _id,
        req.body,
        {},
        GENERAL_USER_FIELDS
    );

    if (!updatedVendor) throw new ApiError();

    res.json(
        new ApiResponse(200, updatedVendor, "Vendor updated successfully"),
    );
});

const updateAccountStatus = asyncHandler(async (req, res) => {
    const { accountStatus, vendorId } = req.body;

    if (!ACCOUNT_STATUS.includes(accountStatus))
        throw new ApiError(400, "Invalid account status");

    const updatedVendor = await vendorService.updateVendorDetails(vendorId, {
        accountStatus,
    }, {}, GENERAL_USER_FIELDS);

    if (!updatedVendor) throw new ApiError();

    res.json(
        new ApiResponse(
            200,
            updatedVendor,
            "Vendor account status updated successfully",
        ),
    );
});

module.exports = {
    createVendor,
    updateVendor,
    updateAccountStatus,
};
