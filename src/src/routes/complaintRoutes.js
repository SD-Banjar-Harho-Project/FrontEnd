import express from "express";
import {
  getAllComplaints,
  getComplaintById,
  getComplaintsByStatus,
  createComplaint,
  updateComplaint,
  assignComplaint,
  resolveComplaint,
  updateComplaintStatus,
  deleteComplaint,
} from "../controllers/complaintController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/", createComplaint); // Anyone can submit complaint

// Admin routes
router.get(
  "/",
  authenticate,
  authorize("admin", "superadmin"),
  getAllComplaints
);

router.get(
  "/status/:status",
  authenticate,
  authorize("admin", "superadmin"),
  getComplaintsByStatus
);

router.get(
  "/:id",
  authenticate,
  authorize("admin", "superadmin"),
  getComplaintById
);

router.put(
  "/:id",
  authenticate,
  authorize("admin", "superadmin"),
  updateComplaint
);

router.put(
  "/:id/assign",
  authenticate,
  authorize("admin", "superadmin"),
  assignComplaint
);

router.put(
  "/:id/resolve",
  authenticate,
  authorize("admin", "superadmin"),
  resolveComplaint
);

router.put(
  "/:id/status",
  authenticate,
  authorize("admin", "superadmin"),
  updateComplaintStatus
);

router.delete(
  "/:id",
  authenticate,
  authorize("admin", "superadmin"),
  deleteComplaint
);

export default router;
