const { Router } = require("express");
const {
    createVendor,
    updateVendor,
    updateAccountStatus,
} = require("../controllers/vendor.controllers");
const {
    isAuthenticated,
    authorise,
} = require("../middlewares/auth.middlewares");
const {
    createVendorValidations,
    updateVendorValidations,
    updateVendorAccStatusValidations,
} = require("../validations/vendor.validations");
const { validate } = require("../middlewares/validate.middlewares");
const router = Router();

router.post(
    "/",
    isAuthenticated,
    authorise("super-admin"),
    validate(createVendorValidations),
    createVendor,
); 

router.patch(
    "/",
    isAuthenticated,
    authorise("vendor"),
    validate(updateVendorValidations),
    updateVendor,
);

router.patch(
    "/account-status",
    isAuthenticated,
    authorise("super-admin"),
    validate(updateVendorAccStatusValidations),
    updateAccountStatus,
);

module.exports = router;
