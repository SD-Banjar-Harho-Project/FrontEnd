import express from "express";
import {
  getAllComplaintResponses,
  getComplaintResponseById,
  getResponsesByComplaint,
  getPublicResponses,
  getInternalNotes,
  createComplaintResponse,
  updateComplaintResponse,
  deleteComplaintResponse,
} from "../controllers/complaintResponseController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin routes
router.get(
  "/",
  authenticate,
  authorize("admin", "superadmin"),
  getAllComplaintResponses
);

router.get(
  "/:id",
  authenticate,
  authorize("admin", "superadmin"),
  getComplaintResponseById
);

router.get(
  "/complaint/:complaintId",
  authenticate,
  authorize("admin", "superadmin"),
  getResponsesByComplaint
);

router.get(
  "/complaint/:complaintId/public",
  getPublicResponses // Public can view (for complaint submitter)
);

router.get(
  "/complaint/:complaintId/internal",
  authenticate,
  authorize("admin", "superadmin"),
  getInternalNotes
);

router.post(
  "/",
  authenticate,
  authorize("admin", "superadmin"),
  createComplaintResponse
);

router.put(
  "/:id",
  authenticate,
  authorize("admin", "superadmin"),
  updateComplaintResponse
);

router.delete(
  "/:id",
  authenticate,
  authorize("admin", "superadmin"),
  deleteComplaintResponse
);

export default router;
