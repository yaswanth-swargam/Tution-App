import express from "express";

import {
  getUnreadSectionMessages,
  markSectionMessagesAsRead,
} from "../controllers/messageRead.controller.js";

import  protectRoute  from "../middleware/auth.middleware.js";

const router = express.Router();

router.get(
  "/section/:sectionId/unread",
  protectRoute,
  getUnreadSectionMessages
);

router.put(
  "/section/:sectionId/read",
  protectRoute,
  markSectionMessagesAsRead
);

export default router;