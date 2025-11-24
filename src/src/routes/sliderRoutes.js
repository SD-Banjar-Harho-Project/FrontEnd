import express from "express";
import {
  getAllSliders,
  getActiveSliders,
  getSliderById,
  getExpiredSliders,
  getUpcomingSliders,
  createSlider,
  updateSlider,
  toggleActive,
  updateOrder,
  deleteSlider,
} from "../controllers/sliderController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/active", getActiveSliders); // Get active sliders for display

// Admin routes
router.get("/", authenticate, authorize("admin", "superadmin"), getAllSliders);

router.get(
  "/expired",
  authenticate,
  authorize("admin", "superadmin"),
  getExpiredSliders
);

router.get(
  "/upcoming",
  authenticate,
  authorize("admin", "superadmin"),
  getUpcomingSliders
);

router.get(
  "/:id",
  authenticate,
  authorize("admin", "superadmin"),
  getSliderById
);

router.post("/", authenticate, authorize("admin", "superadmin"), createSlider);

router.put(
  "/:id",
  authenticate,
  authorize("admin", "superadmin"),
  updateSlider
);

router.put(
  "/:id/toggle",
  authenticate,
  authorize("admin", "superadmin"),
  toggleActive
);

router.put(
  "/:id/order",
  authenticate,
  authorize("admin", "superadmin"),
  updateOrder
);

router.delete(
  "/:id",
  authenticate,
  authorize("admin", "superadmin"),
  deleteSlider
);

export default router;
