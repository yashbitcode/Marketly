const { Router } = require("express");
const {
    getAllVendorPayouts,
    getSpecificVendorPayout,
    makePayout,
    makeTransfer,
} = require("../controllers/vendorPayout.controllers");
const {
    isAuthenticated,
    authorise,
} = require("../middlewares/auth.middlewares");
const router = Router();

router.get("/", isAuthenticated, authorise("super-admin"), getAllVendorPayouts);
router.get(
    "/:vendorPayoutId",
    isAuthenticated,
    authorise("super-admin"),
    getSpecificVendorPayout,
);
router.post(
    "/transfer/:vendorPayoutId",
    isAuthenticated,
    authorise("super-admin"),
    makeTransfer,
);
router.post(
    "/payout/:vendorPayoutId",
    isAuthenticated,
    authorise("super-admin"),
    makePayout,
);

module.exports = router;
