import express from "express";

import {
  createStudyMaterial,
  getSectionMaterials,
  updateStudyMaterial,
  deleteStudyMaterial,
  getAccessibleStudyMaterials,
} from "../controllers/studyMaterial.controller.js";

import protectRoute from "../middleware/auth.middleware.js";

const router = express.Router();

// ==========================================
// SECTION MATERIALS
// ==========================================
router.get(
  "/",
  protectRoute,
  getAccessibleStudyMaterials
);
// Get materials for a section
router.get(
  "/section/:sectionId",
  protectRoute,
  getSectionMaterials
);

// Create material
router.post(
  "/section/:sectionId",
  protectRoute,
  createStudyMaterial
);

// Update material
router.put(
  "/:materialId",
  protectRoute,
  updateStudyMaterial
);

// Delete material
router.delete(
  "/:materialId",
  protectRoute,
  deleteStudyMaterial
);



export default router;