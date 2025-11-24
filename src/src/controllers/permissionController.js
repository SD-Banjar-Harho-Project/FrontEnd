import Permission from "../models/Permission.js";
import {
  successResponse,
  errorResponse,
  paginatedResponse,
} from "../utils/responseHelper.js";
import { getPaginationParams } from "../utils/pagination.js";

export const getAllPermissions = async (req, res, next) => {
  try {
    const { page, limit, offset } = getPaginationParams(req);
    const filters = {
      group: req.query.group,
      search: req.query.search,
    };

    const items = await Permission.findAll(limit, offset, filters);
    const total = await Permission.count(filters);

    return paginatedResponse(
      res,
      items,
      page,
      limit,
      total,
      "Permissions retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

export const getPermissionGroups = async (req, res, next) => {
  try {
    const groups = await Permission.getGroups();
    return successResponse(
      res,
      groups,
      "Permission groups retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

export const getPermissionsByGroup = async (req, res, next) => {
  try {
    const { group } = req.params;
    const permissions = await Permission.getByGroup(group);

    return successResponse(
      res,
      permissions,
      `Permissions for ${group} retrieved successfully`
    );
  } catch (error) {
    next(error);
  }
};

export const getPermissionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const permission = await Permission.findById(id);

    if (!permission) {
      return errorResponse(res, "Permission not found", 404);
    }

    return successResponse(
      res,
      permission,
      "Permission retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

export const getPermissionBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const permission = await Permission.findBySlug(slug);

    if (!permission) {
      return errorResponse(res, "Permission not found", 404);
    }

    return successResponse(
      res,
      permission,
      "Permission retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

export const createPermission = async (req, res, next) => {
  try {
    const data = { ...req.body };
    const permission = await Permission.create(data);

    return successResponse(
      res,
      permission,
      "Permission created successfully",
      201
    );
  } catch (error) {
    if (error.message === "Permission slug already exists") {
      return errorResponse(res, error.message, 409);
    }
    next(error);
  }
};

export const updatePermission = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = { ...req.body };

    const existing = await Permission.findById(id);
    if (!existing) {
      return errorResponse(res, "Permission not found", 404);
    }

    const permission = await Permission.update(id, data);
    return successResponse(res, permission, "Permission updated successfully");
  } catch (error) {
    if (error.message === "Permission slug already exists") {
      return errorResponse(res, error.message, 409);
    }
    next(error);
  }
};

export const deletePermission = async (req, res, next) => {
  try {
    const { id } = req.params;

    const permission = await Permission.findById(id);
    if (!permission) {
      return errorResponse(res, "Permission not found", 404);
    }

    await Permission.delete(id);
    return successResponse(res, null, "Permission deleted successfully");
  } catch (error) {
    if (error.message === "Cannot delete permission that is in use") {
      return errorResponse(res, error.message, 400);
    }
    next(error);
  }
};

export const seedDefaultPermissions = async (req, res, next) => {
  try {
    await Permission.seedDefaults();
    return successResponse(
      res,
      null,
      "Default permissions seeded successfully"
    );
  } catch (error) {
    next(error);
  }
};
