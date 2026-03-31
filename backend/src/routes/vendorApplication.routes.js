import { Router } from "express";
import { isAuthenticated, authorise } from "../middlewares/auth.middlewares.js";
import {
    getAllApplications,
    getUserSpecificApplications,
    createVendorApplication,
    updateVendorApplicationStatus,
} from "../controllers/vendorApplication.controllers.js";
import { validate } from "../middlewares/validate.middlewares.js";
import {
    updateVendorApplicationValidations,
    createVendorApplicationValidations,
} from "../../../shared/validations/vendorApplication.validations.js";
const router = Router();

router.get(
    "/me",
    isAuthenticated,
    authorise("user"),
    getUserSpecificApplications,
);

router.get("/:page", isAuthenticated, authorise("super-admin"), getAllApplications);

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

export default router;
