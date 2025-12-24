const { Router } = require("express");
const {
    registerValidations,
    loginValidations,
    changePasswordValidations,
} = require("../validations/auth.validations");
const { validate } = require("../middlewares/validate.middlewares");
const {
    register,
    login,
    logout,
    verifyEmailSessionId,
    verifyEmailCode,
    changePassword,
} = require("../controllers/auth.controllers");
const { isAuthenticated } = require("../middlewares/auth.middlewares");
const router = Router();

router.post("/register", validate(registerValidations), register);
router.post("/login", validate(loginValidations), login);
router.post(
    "/change-password",
    validate(changePasswordValidations),
    isAuthenticated,
    changePassword,
);
router.post("/logout", isAuthenticated, logout);
router.get("/verify-email/:sessionId", verifyEmailSessionId);
router.get("/verify-email-code/:sessionId/:code", verifyEmailCode);

module.exports = router;
