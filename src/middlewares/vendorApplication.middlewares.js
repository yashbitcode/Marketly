const {validate} = require("../middlewares/validate.middlewares");
const { asyncHandler } = require("../utils/asyncHandler");
const { acceptedVendorApplicationValidations, rejectedVendorApplicationValidations } = require("../validations/vendorApplication.validations");

const vendorApplicationConditional = asyncHandler(async (req, res, next) => {
    const {applicationStatus} = req.body;

    if(applicationStatus && applicationStatus === "accepted") validate(acceptedVendorApplicationValidations)(req, res, next);
    else validate(rejectedVendorApplicationValidations)(req, res, next);

    next();
});

module.exports = {
    vendorApplicationConditional
};