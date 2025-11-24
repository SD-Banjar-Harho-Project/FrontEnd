import express from "express";
import {
  getAllPermissions,
  getPermissionGroups,
  getPermissionsByGroup,
  getPermissionById,
  getPermissionBySlug,
  createPermission,
  updatePermission,
  deletePermission,
  seedDefaultPermissions,
} from "../controllers/permissionController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin only routes
router.get(
  "/",
  authenticate,
  authorize("admin", "super_admin"),
  getAllPermissions
);

router.get(
  "/groups",
  authenticate,
  authorize("admin", "super_admin"),
  getPermissionGroups
);

router.get(
  "/group/:group",
  authenticate,
  authorize("admin", "super_admin"),
  getPermissionsByGroup
);

router.get(
  "/:id",
  authenticate,
  authorize("admin", "super_admin"),
  getPermissionById
);

router.post("/", authenticate, authorize("super_admin"), createPermission);

router.put("/:id", authenticate, authorize("super_admin"), updatePermission);

router.delete("/:id", authenticate, authorize("super_admin"), deletePermission);

export default router;
