import express from "express";

import {
  sections,
  getSectionById,
  renameSection,
  addStudent,
  removeStudent,
  sectionMembers

} from "../controllers/section.controller.js";

import protectRoute from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, sections);

router.get("/:id", protectRoute, getSectionById);

router.put("/:id", protectRoute, renameSection);

router.post('/:id/members',protectRoute,addStudent)
router.delete('/:id/members/:userId',protectRoute,removeStudent)
router.get('/:id/members',protectRoute,sectionMembers)
export default router;