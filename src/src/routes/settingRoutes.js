import express from "express";
import * as settingController from "../controllers/settingController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public route - get public settings (is_public = 1)
router.get("/public", settingController.getPublicSettings);

// Admin routes
router.get(
  "/",
  authenticate,
  authorize("admin", "superadmin"),
  settingController.getAllSettings
);

router.get(
  "/group/:group",
  authenticate,
  authorize("admin", "superadmin"),
  settingController.getSettingsByGroup
);

// Update single setting by key name
router.put(
  "/:key",
  authenticate,
  authorize("admin", "superadmin"),
  settingController.updateSettingByKey
);

// Bulk update (jika ingin update banyak sekaligus)
router.put(
  "/",
  authenticate,
  authorize("admin", "superadmin"),
  settingController.updateMultipleSettings
);

export default router;
