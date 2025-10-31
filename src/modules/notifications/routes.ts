import express from "express";
import { authGuard } from "../../middleware/authGuard";
import { sendEmailHandler, sendPushHandler, getUserNotificationsHandler } from "./controller";

const router = express.Router();

// These routes are protected as they would typically be triggered by other services or admins
router.post("/email", authGuard, sendEmailHandler);
router.post("/push", authGuard, sendPushHandler);

// Add new route for user to fetch their notifications
router.get("/me", authGuard, getUserNotificationsHandler);

export default router;
