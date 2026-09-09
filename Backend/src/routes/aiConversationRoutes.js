import express from "express";

import {
  createConversation,
  deleteConversation,
  getConversation,
  getConversations,
  sendConversationMessage,
  renameConversation,
} from "../controllers/aiConversation.controller.js";

import protectRoute from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, getConversations);

router.post("/", protectRoute, createConversation);

router.get("/:id", protectRoute, getConversation);
router.patch(
  "/:id",
  protectRoute,
  renameConversation
);
router.post(
  "/:id/messages",
  protectRoute,
  sendConversationMessage
);

router.delete("/:id", protectRoute, deleteConversation);

export default router;