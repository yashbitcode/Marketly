import { Router } from "express";
import { isAuthenticated, authorise } from "../middlewares/auth.middlewares.js";
import {
    createRefundApplication,
    getAllRefundApplications,
    getSpecificApplication,
    makeRefund,
} from "../controllers/orderRefundApplication.controllers.js";
import { validate } from "../middlewares/validate.middlewares.js";
import { createOrderRefundApplicationValidations } from "../../../shared/validations/orderRefundApplication.validations.js";
const router = Router();

router.get(
    "/:page",
    isAuthenticated,
    authorise("super-admin"),
    getAllRefundApplications,
);
router.post(
    "/",
    isAuthenticated,
    authorise("user"),
    validate(createOrderRefundApplicationValidations),
    createRefundApplication,
);

router.get("/application/:applicationId", isAuthenticated, authorise("super-admin"), getSpecificApplication);

router.post(
    "/process/:applicationId",
    isAuthenticated,
    authorise("super-admin"),
    makeRefund,
);

export default router;
