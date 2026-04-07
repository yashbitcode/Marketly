import { Router } from "express";
import { isAuthenticated, authorise } from "../middlewares/auth.middlewares.js";
import {
    createStripeConnectedAcc,
    getStripeOnboardingLink,
    checkStripeAccountStatus,
    test
} from "../controllers/vendorStripe.controllers.js";
import { createConnectedAccountValidations } from "shared/validations/vendorStripe.validations.js";
import { validate } from "../middlewares/validate.middlewares.js";
const router = Router();

router.post(
    "/connected-account",
    isAuthenticated,
    authorise("vendor"),
    validate(createConnectedAccountValidations),
    createStripeConnectedAcc,
);

router.get("/test", isAuthenticated, authorise("vendor"), test)

router.get(
    "/onboard-link",
    isAuthenticated,
    authorise("vendor"),
    getStripeOnboardingLink,
);

router.get(
    "/check-status",
    isAuthenticated,
    authorise("vendor"),
    checkStripeAccountStatus,
);

export default router;
