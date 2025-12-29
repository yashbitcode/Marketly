const {Router} = require("express");
const { isAuthenticated } = require("../middlewares/auth.middlewares");
const { updateUser } = require("../controllers/user.controllers");
const { validate } = require("../middlewares/validate.middlewares");
const { updateUserValidations } = require("../validations/user.validations");
const router = Router();

router.patch("/", isAuthenticated, validate(updateUserValidations), updateUser);

module.exports = router;