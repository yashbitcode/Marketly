const {Router} = require("express");
const { getAllVendorPayouts, getSpecificVendorPayout } = require("../controllers/vendorPayout.controllers");
const { isAuthenticated, authorise } = require("../middlewares/auth.middlewares");
const router = Router();

// router.get("/", isAuthenticated, authorise("super-admin"), getAllVendorPayouts);
router.get("/", getAllVendorPayouts);
router.get("/:vendorPayoutId", getSpecificVendorPayout);

module.exports = router;