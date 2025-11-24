// src/routes/index.js
// UPDATED WITH ALL NEW ROUTES

import express from "express";

// Existing routes
import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import postRoutes from "./postRoutes.js";
import teacherRoutes from "./teacherRoutes.js";

// NEW ROUTES - Essential Features
import schoolProfileRoutes from "./schoolProfileRoutes.js";
import pageRoutes from "./pageRoutes.js";
import galleryRoutes from "./galleryRoutes.js";
import settingRoutes from "./settingRoutes.js";
import mediaLibraryRoutes from "./mediaLibraryRoutes.js";

// NEW ROUTES - Security & Permissions
import permissionRoutes from "./permissionRoutes.js";

// NEW ROUTES - User Interactions
import commentRoutes from "./commentRoutes.js";
import complaintRoutes from "./complaintRoutes.js";
import complaintResponseRoutes from "./complaintResponseRoutes.js";
import contactMessageRoutes from "./contactMessageRoutes.js";

// NEW ROUTES - Additional Features
import menuRoutes from "./menuRoutes.js";
import sliderRoutes from "./sliderRoutes.js";
import notificationRoutes from "./notificationRoutes.js";
import activityLogRoutes from "./activityLogRoutes.js";

const router = express.Router();

// Health check
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "SD Negeri Bandarharjo API is running",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// Mount existing routes
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/posts", postRoutes);
router.use("/teachers", teacherRoutes);

// Mount NEW routes - Essential Features
router.use("/school-profile", schoolProfileRoutes);
router.use("/pages", pageRoutes);
router.use("/galleries", galleryRoutes);
router.use("/settings", settingRoutes);
router.use("/media", mediaLibraryRoutes);

// Mount NEW routes - Security & Permissions
router.use("/permissions", permissionRoutes);

// Mount NEW routes - User Interactions
router.use("/comments", commentRoutes);
router.use("/complaint-responses", complaintResponseRoutes);
router.use("/complaints", complaintRoutes);
router.use("/contact", contactMessageRoutes);

// Mount NEW routes - Additional Features
router.use("/menus", menuRoutes);
router.use("/sliders", sliderRoutes);
router.use("/notifications", notificationRoutes);
router.use("/activity-logs", activityLogRoutes);

// 404 handler
router.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
    path: req.originalUrl,
  });
});

export default router;
