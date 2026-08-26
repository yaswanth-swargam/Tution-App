import express from "express";

import {
  sections,
  getSectionById,
  createSection,
  renameSection,
  addStudent,
  removeStudent,
  sectionMembers,
  getAvailableStudents,
  deleteSection
} from "../controllers/section.controller.js";

import protectRoute from "../middleware/auth.middleware.js";

const router = express.Router();

// Get all accessible sections
router.get("/", protectRoute, sections);

// Create a new section/group
router.post("/", protectRoute, createSection);

// Get available students for a section
router.get(
  "/:id/available-students",
  protectRoute,
  getAvailableStudents
);

// Get section members
router.get(
  "/:id/members",
  protectRoute,
  sectionMembers
);

// Add student to section
router.post(
  "/:id/members",
  protectRoute,
  addStudent
);

// Remove student from section
router.delete(
  "/:id/members/:userId",
  protectRoute,
  removeStudent
);

router.delete("/:id", protectRoute, deleteSection);

// Get section by ID
router.get(
  "/:id",
  protectRoute,
  getSectionById
);

// Rename section
router.put(
  "/:id",
  protectRoute,
  renameSection
);

export default router;