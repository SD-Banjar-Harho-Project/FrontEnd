import express from "express";
import {
  getAllContactMessages,
  getContactMessageById,
  getMessagesByStatus,
  getUnreadCount,
  createContactMessage,
  updateContactMessage,
  markAsRead,
  replyMessage,
  updateStatus,
  deleteContactMessage,
} from "../controllers/contactMessageController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/", createContactMessage); // Anyone can send message

// Admin routes
router.get(
  "/",
  authenticate,
  authorize("admin", "superadmin"),
  getAllContactMessages
);

router.get(
  "/unread-count",
  authenticate,
  authorize("admin", "superadmin"),
  getUnreadCount
);

router.get(
  "/status/:status",
  authenticate,
  authorize("admin", "superadmin"),
  getMessagesByStatus
);

router.get(
  "/:id",
  authenticate,
  authorize("admin", "superadmin"),
  getContactMessageById
);

router.put(
  "/:id",
  authenticate,
  authorize("admin", "superadmin"),
  updateContactMessage
);

router.put(
  "/:id/mark-read",
  authenticate,
  authorize("admin", "superadmin"),
  markAsRead
);

router.put(
  "/:id/reply",
  authenticate,
  authorize("admin", "superadmin"),
  replyMessage
);

router.put(
  "/:id/status",
  authenticate,
  authorize("admin", "superadmin"),
  updateStatus
);

router.delete(
  "/:id",
  authenticate,
  authorize("admin", "superadmin"),
  deleteContactMessage
);

export default router;
