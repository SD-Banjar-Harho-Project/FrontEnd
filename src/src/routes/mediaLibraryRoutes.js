import express from "express";
import {
  getAllMediaLibrary,
  getMediaLibraryById,
  getMediaByType,
  createMediaLibrary,
  updateMediaLibrary,
  deleteMediaLibrary,
} from "../controllers/mediaLibraryController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllMediaLibrary); // ← GANTI INI
router.get("/type/:type", getMediaByType); // ← TAMBAHKAN INI (optional)
router.get("/:id", getMediaLibraryById);

// Protected routes
router.post(
  "/",
  authenticate,
  authorize("admin", "superadmin"),
  createMediaLibrary
);
router.put(
  "/:id",
  authenticate,
  authorize("admin", "superadmin"),
  updateMediaLibrary
);
router.delete(
  "/:id",
  authenticate,
  authorize("admin", "superadmin"),
  deleteMediaLibrary
);

export default router;
