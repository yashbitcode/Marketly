import { getMe } from "../controllers/me.controllers.js";
import {
    isAuthenticated,
    authorise,
} from "../middlewares/auth.middlewares.js";
import { Router } from "express";
const router = Router();

router.get(
    "/",
    isAuthenticated,
    authorise("user", "vendor", "super-admin"),
    getMe,
);

export default router;
