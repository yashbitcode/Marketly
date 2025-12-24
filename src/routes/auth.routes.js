const { Router } = require("express");
const { registerValidations, loginValidations } = require("../validations/auth.validations");
const { validate } = require("../middlewares/validate.middlewares");
const { register, login, logout } = require("../controllers/auth.controllers");
const router = Router();

router.post("/register", validate(registerValidations), register);
router.post("/login", validate(loginValidations), login);
router.post("/logout", logout);

module.exports = router;
