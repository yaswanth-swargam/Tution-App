import express from "express";

import {
  sendDirectMessage,
  getDirectMessages,
  getDirectConversations,
} from "../controllers/directMessage.controller.js";

import protectRoute from "../middleware/auth.middleware.js";

const router = express.Router();

router.get(
  "/conversations",
  protectRoute,
  getDirectConversations
);

router.get(
  "/:userId",
  protectRoute,
  getDirectMessages
);

router.post(
  "/:receiverId",
  protectRoute,
  sendDirectMessage
);
export default router;