import express from "express";

import { sendMessage,sectionMessages } from "../controllers/message.controller.js";
import protectRoute from "../middleware/auth.middleware.js";

const router = express.Router();

router.post(
  "/section/:sectionId",
  protectRoute,
  sendMessage
);

router.get('/section/:sectionId',protectRoute,sectionMessages)

export default router;