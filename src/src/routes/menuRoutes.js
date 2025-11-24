import express from "express";
import {
  getAllMenus,
  getMenuById,
  getMenusByLocation,
  getLocations,
  createMenu,
  updateMenu,
  deleteMenu,
} from "../controllers/menuController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllMenus);
router.get("/locations", getLocations);
router.get("/location/:location", getMenusByLocation);
router.get("/:id", getMenuById);

// Admin routes
router.post("/", authenticate, authorize("admin", "superadmin"), createMenu);

router.put("/:id", authenticate, authorize("admin", "superadmin"), updateMenu);

router.delete(
  "/:id",
  authenticate,
  authorize("admin", "superadmin"),
  deleteMenu
);

export default router;
