import { Router } from "express";
import {
    getAllVendorPayouts,
    getSpecificVendorPayout,
    makePayout,
    makeTransfer,
} from "../controllers/vendorPayout.controllers.js";
import { isAuthenticated, authorise } from "../middlewares/auth.middlewares.js";
const router = Router();

router.get("/:page", isAuthenticated, authorise("super-admin"), getAllVendorPayouts);
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

export default router;
