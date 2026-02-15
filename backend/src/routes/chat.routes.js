const { Router } = require("express");
const {
    isAuthenticated,
    authorise,
} = require("../middlewares/auth.middlewares");
const { validate } = require("../middlewares/validate.middlewares");
const {
    getAllChatsReqs,
    createChatRequest,
    updateChatRequest,
} = require("../controllers/chat.controllers");
const {
    createChatReqValidations,
    updateChatReqStatusValidations,
} = require("../validations/chat.validations");
const router = Router();

router.get(
    "/:page",
    // isAuthenticated,
    // authorise("super-admin", "vendor", "user"),
    getAllChatsReqs,
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
