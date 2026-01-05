const { Router } = require("express");
const {
    isAuthenticated,
    authorise,
} = require("../middlewares/auth.middlewares");
const { validate } = require("../middlewares/validate.middlewares");
const {
    getAllChats,
    getAllVendorChats,
    getAllUserChats,
    createChatRequest,
    updateChatRequest,
} = require("../controllers/chat.controllers");
const {
    createChatReqValidations,
    updateChatReqStatusValidations,
} = require("../validations/chat.validations");
const router = Router();

router.get("/", isAuthenticated, authorise("super-admin"), getAllChats);

router.get("/vendor", isAuthenticated, authorise("vendor"), getAllVendorChats);

router.get("/user", isAuthenticated, authorise("user"), getAllUserChats);

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
    authorise("super-admin"),
    validate(updateChatReqStatusValidations),
    updateChatRequest,
);

module.exports = router;
