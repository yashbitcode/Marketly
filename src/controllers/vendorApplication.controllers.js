const vendorApplicationService = require("../services/vendorApplication.service");
const ApiError = require("../utils/api-error");
const ApiResponse = require("../utils/api-response");
const { asyncHandler } = require("../utils/asyncHandler");

const getAllApplications = asyncHandler(async (req, res) => {
    const allApplications = await vendorApplicationService.getAll();

    res.json(new ApiResponse(200, allApplications, "Applications fetched successfully"));
});

const getUserSpecificApplications = asyncHandler(async (req, res) => {
    const {_id} = req.user;

    const allApplications = await vendorApplicationService.getUserApplications(_id);

    res.json(new ApiResponse(200, allApplications, "Applications fetched successfully"));
});

const updateVendorApplicationStatus = asyncHandler(async (req, res) => {
    const { applicationId } = req.params;
    const { applicationStatus, remarks } = req.body;

    const updatedApplication = await vendorApplicationService.updateApplication(
        { _id: applicationId, applicationStatus: "pending" },
        { applicationStatus, remarks },
    );

    if (!updatedApplication) throw new ApiError(404, "Application not found or already resolved");

    if (applicationStatus === "rejected")
        return res.json(
            new ApiResponse(
                200,
                updatedApplication,
                "Application updated successful",
            ),
        );

    const { vendor } = await vendorApplicationService.createVendorAndUpdateUser(
        updatedApplication,
    );

    updatedApplication.vendor = vendor._id;

    await updatedApplication.save();

    res.json(
        new ApiResponse(
            200,
            updatedApplication,
            "Application updated successful",
        ),
    );
});

const createVendorApplication = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const payload = req.body;

    const application = await vendorApplicationService.createApplication(
        _id,
        payload,
    );

    res.json(
        new ApiResponse(201, application, "Application created successfully"),
    );
});

module.exports = {
    getAllApplications,
    getUserSpecificApplications,
    createVendorApplication,
    updateVendorApplicationStatus,
};
