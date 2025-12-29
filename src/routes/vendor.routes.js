const { Router } = require("express");
const { createVendor, updateVendor, updateAccountStatus } = require("../controllers/vendor.controllers");
const { isAuthenticated } = require("../middlewares/auth.middlewares");
const { createVendorValidations, updateVendorValidations, updateVendorAccStatusValidations } = require("../validations/vendor.validations");
const { validate } = require("../middlewares/validate.middlewares");
const router = Router();

router.post("/", validate(createVendorValidations), createVendor); // super-admin
router.patch("/", isAuthenticated, validate(updateVendorValidations), updateVendor);

router.patch("/account-status", validate(updateVendorAccStatusValidations), updateAccountStatus); // super-admin

module.exports = router;
