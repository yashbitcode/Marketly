const { Router } = require("express");
const {
    isAuthenticated,
    authorise,
} = require("../middlewares/auth.middlewares");
const { validate } = require("../middlewares/validate.middlewares");
const {
    getAllChats,
    createChatRequest,
    updateChatRequest,
} = require("../controllers/chat.controllers");
const {
    createChatReqValidations,
    updateChatReqStatusValidations,
} = require("../validations/chat.validations");
const router = Router();

router.get(
    "/",
    isAuthenticated,
    authorise("super-admin", "vendor", "user"),
    getAllChats,
);

router.post(
    "/user",
    isAuthenticated,
    authorise("user"),
    validate(createChatReqValidations),
    createChatRequest,
);

router.patch(
    "/",
    isAuthenticated,
    authorise("vendor"),
    validate(updateChatReqStatusValidations),
    updateChatRequest,
);

module.exports = router;
