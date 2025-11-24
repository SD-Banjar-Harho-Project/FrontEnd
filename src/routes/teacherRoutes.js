import express from "express";
import { body } from "express-validator";
import { validate } from "../middleware/validator.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";
import * as teacherController from "../controllers/teacherController.js";

const router = express.Router();

// ✅ Routes tanpa parameter dulu
router.get("/", teacherController.getAllTeachers);

// ✅ Routes dengan path spesifik SEBELUM routes dengan parameter
router.get(
  "/deleted",
  authenticate,
  authorize("admin", "superadmin"),
  teacherController.getDeletedTeachers
);

// ✅ Routes dengan parameter di bawah
router.get("/:id", teacherController.getTeacherById);

router.post(
  "/",
  authenticate,
  authorize("admin", "superadmin"),
  [
    body("full_name").notEmpty().withMessage("Full name is required"),
    body("nip").optional().notEmpty().withMessage("NIP cannot be empty"),
    body("email").optional().isEmail().withMessage("Valid email is required"),
    validate,
  ],
  teacherController.createTeacher
);

router.put(
  "/:id",
  authenticate,
  authorize("admin", "superadmin"),
  [body("full_name").notEmpty().withMessage("Full name is required"), validate],
  teacherController.updateTeacher
);

// ✅ Route restore juga harus sebelum delete dengan /:id
router.post(
  "/:id/restore",
  authenticate,
  authorize("admin", "superadmin"),
  teacherController.restoreTeacher
);

router.delete(
  "/:id",
  authenticate,
  authorize("admin", "superadmin"),
  teacherController.deleteTeacher
);

export default router;
