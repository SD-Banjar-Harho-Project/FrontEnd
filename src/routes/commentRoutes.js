import express from "express";
import {
  getAllComments,
  getCommentById,
  getCommentsByPost,
  getCommentReplies,
  createComment,
  updateComment,
  approveComment,
  rejectComment,
  deleteComment,
} from "../controllers/commentController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllComments);
router.get("/post/:postId", getCommentsByPost); // Get comments by post
router.get("/:id", getCommentById);
router.get("/:id/replies", getCommentReplies); // Get replies

// Create comment (bisa public atau authenticated)
router.post("/", createComment); // User bisa comment tanpa login (guest) atau dengan login

// Admin routes
router.put(
  "/:id",
  authenticate,
  authorize("admin", "superadmin"),
  updateComment
);
router.put(
  "/:id/approve",
  authenticate,
  authorize("admin", "superadmin"),
  approveComment
);
router.put(
  "/:id/reject",
  authenticate,
  authorize("admin", "superadmin"),
  rejectComment
);
router.delete(
  "/:id",
  authenticate,
  authorize("admin", "superadmin"),
  deleteComment
);

export default router;
