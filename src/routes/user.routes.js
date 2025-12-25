const {Router} = require("express");
const { isAuthenticated } = require("../middlewares/auth.middlewares");
const { getUser, updateUser } = require("../controllers/user.controllers");
const { validate } = require("../middlewares/validate.middlewares");
const { updateUserValidations } = require("../validations/user.validations");
const router = Router();

router.get("/", isAuthenticated, getUser);
router.patch("/", isAuthenticated, validate(updateUserValidations), updateUser);

module.exports = router;