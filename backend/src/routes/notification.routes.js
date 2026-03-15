import { Router } from "express";
import { authorise, isAuthenticated } from "../middlewares/auth.middlewares.js";
import { getAllNotifications, markNotificationAsRead } from "../controllers/notification.controllers.js";

const router = Router();

router.get(
    "/",
    isAuthenticated,
    authorise("vendor", "user"),
    getAllNotifications,
);

router.patch("/:notificationId", isAuthenticated, authorise("vendor", "user"), markNotificationAsRead);

export default router;
