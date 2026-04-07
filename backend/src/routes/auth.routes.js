import { Router } from "express";
import {
    registerValidations,
    loginValidations,
    changePasswordValidations,
    forgotPasswordLinkValidations,
    resetPasswordValidations,
} from "shared/validations/auth.validations.js";
import { validate } from "../middlewares/validate.middlewares.js";
import {
    register,
    login,
    loginVendor,
    loginSuperAdmin,
    logout,
    verifyEmailSessionId,
    verifyEmailCode,
    changePassword,
    forgotPasswordLink,
    forgotPasswordVerification,
    resetPassword,
} from "../controllers/auth.controllers.js";
import { isAuthenticated, authorise } from "../middlewares/auth.middlewares.js";
const router = Router();

router.post("/register", validate(registerValidations), register);

router.post("/login", validate(loginValidations), login);

router.post("/vendor-login", validate(loginValidations), loginVendor);

router.post("/super-admin-login", validate(loginValidations), loginSuperAdmin);

router.post(
    "/change-password",
    validate(changePasswordValidations),
    isAuthenticated,
    authorise("user", "vendor"),
    changePassword,
);

router.post(
    "/forgot-password-link",
    validate(forgotPasswordLinkValidations),
    forgotPasswordLink,
);

router.post(
    "/reset-password/:resetToken",
    validate(resetPasswordValidations),
    resetPassword,
);

router.post("/logout", isAuthenticated, authorise("user", "super-admin", "vendor"), logout);

router.get("/verify-email/:sessionId", verifyEmailSessionId);

router.get("/verify-email-code/:sessionId/:code", verifyEmailCode);

router.get("/forgot-password/:resetToken", forgotPasswordVerification);

export default router;
