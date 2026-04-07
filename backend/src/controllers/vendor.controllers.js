import userService from "../services/user.service.js";
import vendorService from "../services/vendor.service.js";
import ApiError from "../utils/api-error.js";
import ApiResponse from "../utils/api-response.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
    ACCOUNT_STATUS,
    GENERAL_USER_FIELDS,
} from "shared/constants.js";

const getAllVendors = asyncHandler(async (req, res) => {
    const { page } = req.params;
    const { data, totalCount } = await vendorService.getAll(page);

    res.json(
        new ApiResponse(
            200,
            { vendors: data, totalCount },
            "Vendors fetched successfully",
        ),
    );
});

const createVendor = asyncHandler(async (req, res) => {
    const { _id } = req.user;

    const vendor = await vendorService.insertVendor(req.body);

    if (!vendor) throw new ApiError();

    const user = await userService.updateUserData(
        { _id },
        { vendorId: vendor._id, role: "vendor" },
        GENERAL_USER_FIELDS,
    );

    if (!user) throw new ApiError();

    res.json(
        new ApiResponse(
            201,
            { ...user._doc, vendor },
            "Vendor created successfully",
        ),
    );
});

const updateVendor = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const updatedVendor = await vendorService.updateVendorDetails(
        _id,
        req.body,
        {},
        GENERAL_USER_FIELDS,
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

    const updatedVendor = await vendorService.updateVendorDetails(
        vendorId,
        {
            accountStatus,
        },
        {},
        GENERAL_USER_FIELDS,
    );

    if (!updatedVendor) throw new ApiError();

    res.json(
        new ApiResponse(
            200,
            updatedVendor,
            "Vendor account status updated successfully",
        ),
    );
});

export { getAllVendors, createVendor, updateVendor, updateAccountStatus };
