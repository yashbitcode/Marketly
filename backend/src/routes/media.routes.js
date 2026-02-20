import { Router } from "express";
const router = Router();
import { isAuthenticated, authorise } from "../middlewares/auth.middlewares.js";
// import multer from "../utils/multerUpload.js";
import {
    getAuthParams,
    deleteFiles,
    getFiles,
} from "../controllers/media.controllers.js";

router.post("/", isAuthenticated, authorise("user", "vendor"), getAuthParams);
router.delete(
    "/files",
    isAuthenticated,
    authorise("user", "vendor"),
    deleteFiles,
);
router.post("/files", isAuthenticated, authorise("user", "vendor"), getFiles);

export default router;
