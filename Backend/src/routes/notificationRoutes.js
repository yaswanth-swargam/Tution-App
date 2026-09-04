import express from "express";

import protectRoute from "../middleware/auth.middleware.js";

import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  sendNotification,
  getNotificationLogs,
} from "../controllers/notification.controller.js";

const router = express.Router();


// Student/Admin
router.get("/", protectRoute, getNotifications);
router.get("/logs", protectRoute, getNotificationLogs);
router.get("/unread-count", protectRoute, getUnreadCount);

router.patch("/:id/read", protectRoute, markAsRead);

router.patch("/read-all", protectRoute, markAllAsRead);


// Admin
router.post("/send", protectRoute, sendNotification);


export default router;