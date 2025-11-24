import express from "express";
import {
  getAllGalleries,
  getGalleryById,
  createGallery,
  updateGallery,
  deleteGallery,
  getDeletedGalleries,
  restoreGallery,
} from "../controllers/galleryController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllGalleries);
// Add these routes
router.get(
  "/deleted",
  authenticate,
  authorize("admin", "superadmin"),
  getDeletedGalleries
);
router.post(
  "/:id/restore",
  authenticate,
  authorize("admin", "superadmin"),
  restoreGallery
);
router.get("/:id", getGalleryById);

// Admin routes
router.post(
  "/",
  authenticate,
  authorize("admin", "super_admin"),
  createGallery
);
router.put(
  "/:id",
  authenticate,
  authorize("admin", "super_admin"),
  updateGallery
);
router.delete(
  "/:id",
  authenticate,
  authorize("admin", "super_admin"),
  deleteGallery
);

export default router;
