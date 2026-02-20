import { Router } from "express";
import {
    createVendor,
    updateVendor,
    updateAccountStatus,
    getAllVendors,
} from "../controllers/vendor.controllers.js";
import {
    isAuthenticated,
    authorise,
} from "../middlewares/auth.middlewares.js";
import {
    createVendorValidations,
    updateVendorValidations,
    updateVendorAccStatusValidations,
} from "../validations/vendor.validations.js";
import { validate } from "../middlewares/validate.middlewares.js";
const router = Router();

router.get("/:page", isAuthenticated, authorise("super-admin"), getAllVendors);

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

export default router;
