const { Router } = require("express");
const {
    isAuthenticated,
    authorise,
} = require("../middlewares/auth.middlewares");
const { updateUser, getAllUsers } = require("../controllers/user.controllers");
const { validate } = require("../middlewares/validate.middlewares");
const { updateUserValidations } = require("../validations/user.validations");
const router = Router();

router.get("/", isAuthenticated, authorise("super-admin"), getAllUsers);

router.patch(
    "/",
    isAuthenticated,
    authorise("user"),
    validate(updateUserValidations),
    updateUser,
);

module.exports = router;
