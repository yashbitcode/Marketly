import { Router } from "express";
import { isAuthenticated, authorise } from "../middlewares/auth.middlewares.js";
import { validate } from "../middlewares/validate.middlewares.js";
import {
    getAllChatsReqs,
    createChatRequest,
    updateChatRequest,
    getMessages
} from "../controllers/chat.controllers.js";
import {
    createChatReqValidations,
    updateChatReqStatusValidations,
} from "shared/validations/chat.validations.js";
const router = Router();

router.get(
    "/:page",
    isAuthenticated,
    authorise("super-admin", "vendor", "user"),
    getAllChatsReqs,
);

router.get("/message/:chatId", isAuthenticated, authorise("super-admin", "vendor", "user"), getMessages)

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

export default router;
