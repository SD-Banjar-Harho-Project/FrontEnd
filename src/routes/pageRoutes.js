import express from "express";
import * as pageController from "../controllers/pageController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", pageController.getAllPages);
router.get("/slug/:slug", pageController.getPageBySlug);

// Restore routes (admin only)
router.get(
  "/deleted",
  authenticate,
  authorize("admin", "superadmin"),
  pageController.getDeletedPages
);

router.post(
  "/:id/restore",
  authenticate,
  authorize("admin", "superadmin"),
  pageController.restorePage
);

// Get by ID
router.get("/:id", pageController.getPageById);

// Admin CRUD routes
router.post(
  "/",
  authenticate,
  authorize("admin", "super_admin"),
  pageController.createPage
);

router.put(
  "/:id",
  authenticate,
  authorize("admin", "super_admin"),
  pageController.updatePage
);

router.delete(
  "/:id",
  authenticate,
  authorize("admin", "super_admin"),
  pageController.deletePage
);

export default router;
