import express from "express";
import { body } from "express-validator";
import { validate } from "../middleware/validator.js";
import { authenticate } from "../middleware/authMiddleware.js";
import * as authController from "../controllers/authController.js";

const router = express.Router();

router.post(
  "/register",
  [
    body("username")
      .notEmpty()
      .withMessage("Username is required")
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("full_name").notEmpty().withMessage("Full name is required"),
    validate,
  ],
  authController.register
);

router.post(
  "/login",
  [
    body("username").notEmpty().withMessage("Username is required"),
    body("password").notEmpty().withMessage("Password is required"),
    validate,
  ],
  authController.login
);

router.get("/profile", authenticate, authController.getProfile);

router.put(
  "/profile",
  authenticate,
  [
    body("email").optional().isEmail().withMessage("Valid email is required"),
    body("full_name")
      .optional()
      .notEmpty()
      .withMessage("Full name cannot be empty"),
    validate,
  ],
  authController.updateProfile
);

router.post(
  "/change-password",
  authenticate,
  [
    body("old_password").notEmpty().withMessage("Current password is required"),
    body("new_password")
      .isLength({ min: 6 })
      .withMessage("New password must be at least 6 characters"),
    validate,
  ],
  authController.changePassword
);

router.post("/logout", authenticate, authController.logout);

export default router;
