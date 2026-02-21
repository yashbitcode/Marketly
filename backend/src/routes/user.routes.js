import { Router } from "express";
import { isAuthenticated, authorise } from "../middlewares/auth.middlewares.js";
import { updateUser, getAllUsers } from "../controllers/user.controllers.js";
import { validate } from "../middlewares/validate.middlewares.js";
import { updateUserValidations } from "../../../shared/validations/user.validations.js";
const router = Router();

router.get("/:page", isAuthenticated, authorise("super-admin"), getAllUsers);

router.patch(
    "/",
    isAuthenticated,
    authorise("user"),
    validate(updateUserValidations),
    updateUser,
);

export default router;
