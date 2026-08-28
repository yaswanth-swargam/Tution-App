import express from "express";

import { uploadFile } from "../controllers/uploadController.js";

import upload from "../middleware/upload.js";
import protectRoute from "../middleware/auth.middleware.js";

const router = express.Router();

router.post(
  "/",
  protectRoute,
  upload.single("file"),
  uploadFile
);

export default router;