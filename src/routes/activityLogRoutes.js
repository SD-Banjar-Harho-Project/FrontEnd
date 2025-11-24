import express from "express";
import {
  getAllActivityLogs,
  getMyActivityLogs,
  getRecentActivities,
  getActivityLogById,
  getLogsByModel,
  getLogsByAction,
  getStatistics,
  createActivityLog,
  cleanupOldLogs,
  deleteActivityLog,
} from "../controllers/activityLogController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// User routes
router.get("/me", authenticate, getMyActivityLogs);

// Admin routes
router.get(
  "/",
  authenticate,
  authorize("admin", "super_admin"),
  getAllActivityLogs
);

router.get(
  "/recent",
  authenticate,
  authorize("admin", "super_admin"),
  getRecentActivities
);

router.get(
  "/statistics",
  authenticate,
  authorize("admin", "super_admin"),
  getStatistics
);

router.get(
  "/action/:action",
  authenticate,
  authorize("admin", "super_admin"),
  getLogsByAction
);

router.get(
  "/model/:modelType/:modelId",
  authenticate,
  authorize("admin", "super_admin"),
  getLogsByModel
);

router.get(
  "/:id",
  authenticate,
  authorize("admin", "super_admin"),
  getActivityLogById
);

router.post("/", authenticate, authorize("super_admin"), createActivityLog);

router.post("/cleanup", authenticate, authorize("super_admin"), cleanupOldLogs);

router.delete(
  "/:id",
  authenticate,
  authorize("super_admin"),
  deleteActivityLog
);

export default router;
