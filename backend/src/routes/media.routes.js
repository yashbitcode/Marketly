import { Router } from "express";
const router = Router();
import { isAuthenticated, authorise } from "../middlewares/auth.middlewares.js";
// import multer from "../utils/multerUpload.js";
import {
    getAuthParams,
    deleteFiles,
    getFiles,
} from "../controllers/media.controllers.js";
import { getImageKitTokensValidations } from "../../../shared/validations/media.validations.js";
import { validate } from "../middlewares/validate.middlewares.js";

router.post("/", validate(getImageKitTokensValidations), getAuthParams);
// router.post("/", isAuthenticated, authorise("user", "vendor"), getAuthParams);
router.post(
    "/files",
    isAuthenticated,
    authorise("user", "vendor"),
    deleteFiles,
);
router.post("/files", isAuthenticated, authorise("user", "vendor"), getFiles);

export default router;
