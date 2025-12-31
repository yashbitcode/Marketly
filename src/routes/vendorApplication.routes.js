const { Router } = require("express");
const {
    isAuthenticated,
    authorise,
} = require("../middlewares/auth.middlewares");
const {
    getAllApplications,
    getUserSpecificApplications,
    createVendorApplication,
    updateVendorApplicationStatus,
} = require("../controllers/vendorApplication.controllers");
const { validate } = require("../middlewares/validate.middlewares");
const {
    updateVendorApplicationValidations,
    createVendorApplicationValidations,
} = require("../validations/vendorApplication.validations");
const router = Router();

router.get("/", isAuthenticated, authorise("super-admin"), getAllApplications);
router.get(
    "/me",
    isAuthenticated,
    authorise("user"),
    getUserSpecificApplications,
);
router.post(
    "/me",
    isAuthenticated,
    authorise("user"),
    validate(createVendorApplicationValidations),
    createVendorApplication,
);
router.patch(
    "/vendor-status/:applicationId",
    isAuthenticated,
    authorise("super-admin"),
    validate(updateVendorApplicationValidations),
    updateVendorApplicationStatus,
);

module.exports = router;
