import { Router } from "express";
import { isAuthenticated, authorise } from "../middlewares/auth.middlewares.js";
import {
    createRefundApplication,
    getAllRefundApplications,
} from "../controllers/orderRefundApplication.controllers.js";
import { validate } from "../middlewares/validate.middlewares.js";
import { createOrderRefundApplicationValidations } from "../../../shared/validations/orderRefundApplication.validations.js";
const router = Router();

router.get(
    "/",
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

export default router;
