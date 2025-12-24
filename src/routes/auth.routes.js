const { Router } = require("express");
const {
    registerValidations,
    loginValidations,
} = require("../validations/auth.validations");
const { validate } = require("../middlewares/validate.middlewares");
const {
    register,
    login,
    logout,
    verifyEmailSessionId,
} = require("../controllers/auth.controllers");
const { isAuthenticated } = require("../middlewares/auth.middlewares");
const router = Router();

router.post("/register", validate(registerValidations), register);
router.post("/login", validate(loginValidations), login);
router.post("/logout", isAuthenticated, logout);
router.get("/verify-email/:sessionId", verifyEmailSessionId);

module.exports = router;
