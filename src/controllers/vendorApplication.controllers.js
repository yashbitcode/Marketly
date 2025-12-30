const VendorApplicationService = require("../services/vendorApplication.service");

const getAllApplications = asyncHandler(async (req, res) => {
    const allApplications = await VendorApplicationService.getAll();

    return allApplications;
});

/* 
    (id, status) -> updateStatus -if rejected-> only update -if accepted-> update app. & create vendor with application details
*/

const updateVendorApplicationStatus = asyncHandler(async (req, res) => {
    const { applicationId } = req.params;
    const { applicationStatus, remarks } = req.body;

    const updatedApplication = await VendorApplicationService.updateStatus(
        applicationId,
        { applicationStatus, remarks },
    );

    if (applicationStatus === "rejected")
        return res.json(
            new ApiResponse(
                200,
                updatedApplication,
                "Application updated successful",
            ),
        );

    const { vendor } = await VendorApplicationService.createVendorAndUpdateUser(
        updatedApplication,
    );

    updatedApplication.vendor = vendor._id;

    await updatedApplication.save();

    return res.json(
        new ApiResponse(
            200,
            updatedApplication,
            "Application updated successful",
        ),
    );
});

module.exports = {
    getAllApplications,
    updateVendorApplicationStatus,
};
