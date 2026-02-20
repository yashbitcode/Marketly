import { validate } from "../middlewares/validate.middlewares.js";
import { asyncHandler } from "../utils/asyncHandler.js";
const {
    acceptedVendorApplicationValidations,
    rejectedVendorApplicationValidations,
} = require("../validations/vendorApplication.validations");

const vendorApplicationConditional = asyncHandler(async (req, res, next) => {
    const { applicationStatus } = req.body;

    if (applicationStatus && applicationStatus === "accepted")
        validate(acceptedVendorApplicationValidations)(req, res, next);
    else validate(rejectedVendorApplicationValidations)(req, res, next);

    next();
});

export { vendorApplicationConditional };
