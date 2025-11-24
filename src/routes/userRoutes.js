import express from "express";
import { body } from "express-validator";
import { validate } from "../middleware/validator.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";
import * as userController from "../controllers/userController.js";

const router = express.Router();

router.get(
  "/",
  authenticate,
  authorize("admin", "superadmin"),
  userController.getAllUsers
);
router.get(
  "/:id",
  authenticate,
  authorize("admin", "superadmin"),
  userController.getUserById
);

router.post(
  "/",
  authenticate,
  authorize("admin", "superadmin"),
  [
    body("username").notEmpty().withMessage("Username is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("full_name").notEmpty().withMessage("Full name is required"),
    body("role_id")
      .notEmpty()
      .isInt()
      .withMessage("Role ID must be an integer"),
    validate,
  ],
  userController.createUser
);

router.put(
  "/:id",
  authenticate,
  authorize("admin", "superadmin"),
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("full_name").notEmpty().withMessage("Full name is required"),
    body("role_id")
      .notEmpty()
      .isInt()
      .withMessage("Role ID must be an integer"),
    validate,
  ],
  userController.updateUser
);

router.delete(
  "/:id",
  authenticate,
  authorize("admin", "superadmin"),
  userController.deleteUser
);

router.post(
  "/:id/reset-password",
  authenticate,
  authorize("admin", "superadmin"),
  [
    body("new_password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    validate,
  ],
  userController.resetPassword
);

// Add these routes
router.get(
  "/deleted",
  authenticate,
  authorize("admin", "superadmin"),
  userController.getDeletedUsers
);
router.post(
  "/:id/restore",
  authenticate,
  authorize("admin", "superadmin"),
  userController.restoreUser
);

export default router;
