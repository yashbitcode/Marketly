const { Router } = require("express");
const {
    registerValidations,
    loginValidations,
    changePasswordValidations,
    forgotPasswordLinkValidations,
    resetPasswordValidations,
} = require("../validations/auth.validations");
const { validate } = require("../middlewares/validate.middlewares");
const {
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
} = require("../controllers/auth.controllers");
const {
    isAuthenticated,
    authorise,
} = require("../middlewares/auth.middlewares");
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

router.post("/logout", isAuthenticated, authorise("user", "vendor"), logout);

router.get("/verify-email/:sessionId", verifyEmailSessionId);

router.get("/verify-email-code/:sessionId/:code", verifyEmailCode);

router.get("/forgot-password/:resetToken", forgotPasswordVerification);

module.exports = router;
