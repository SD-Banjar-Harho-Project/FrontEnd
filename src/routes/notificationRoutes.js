import express from "express";
import {
  getAllNotifications,
  getMyNotifications,
  getUnreadNotifications,
  getUnreadCount,
  getNotificationById,
  createNotification,
  createBroadcastNotification,
  updateNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../controllers/notificationController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// User routes (authenticated)
router.get("/me", authenticate, getMyNotifications);
router.get("/me/unread", authenticate, getUnreadNotifications);
router.get("/me/unread-count", authenticate, getUnreadCount);
router.put("/me/mark-all-read", authenticate, markAllAsRead);
router.get("/:id", authenticate, getNotificationById);
router.put("/:id/read", authenticate, markAsRead);
router.delete("/:id", authenticate, deleteNotification);

// Admin routes
router.get(
  "/",
  authenticate,
  authorize("admin", "superadmin"),
  getAllNotifications
);

router.post(
  "/",
  authenticate,
  authorize("admin", "superadmin"),
  createNotification
);

router.post(
  "/broadcast",
  authenticate,
  authorize("admin", "superadmin"),
  createBroadcastNotification
);

router.put(
  "/:id",
  authenticate,
  authorize("admin", "superadmin"),
  updateNotification
);

export default router;
