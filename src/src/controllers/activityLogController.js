import ActivityLog from "../models/ActivityLog.js";
import {
  successResponse,
  errorResponse,
  paginatedResponse,
} from "../utils/responseHelper.js";
import { getPaginationParams } from "../utils/pagination.js";

export const getAllActivityLogs = async (req, res, next) => {
  try {
    const { page, limit, offset } = getPaginationParams(req);
    const filters = {
      user_id: req.query.user_id,
      action: req.query.action,
      model_type: req.query.model_type,
      model_id: req.query.model_id,
      date_from: req.query.date_from,
      date_to: req.query.date_to,
    };

    const items = await ActivityLog.findAll(limit, offset, filters);
    const total = await ActivityLog.count(filters);

    return paginatedResponse(
      res,
      items,
      page,
      limit,
      total,
      "Activity logs retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

export const getMyActivityLogs = async (req, res, next) => {
  try {
    const { page, limit, offset } = getPaginationParams(req);
    const userId = req.user.id;

    const logs = await ActivityLog.findByUserId(userId, limit, offset);
    const total = await ActivityLog.count({ user_id: userId });

    return paginatedResponse(
      res,
      logs,
      page,
      limit,
      total,
      "Your activity logs retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

export const getRecentActivities = async (req, res, next) => {
  try {
    const limit = req.query.limit || 20;
    const logs = await ActivityLog.getRecent(limit);

    return successResponse(
      res,
      logs,
      "Recent activities retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

export const getActivityLogById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const log = await ActivityLog.findById(id);

    if (!log) {
      return errorResponse(res, "Activity log not found", 404);
    }

    return successResponse(res, log, "Activity log retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const getLogsByModel = async (req, res, next) => {
  try {
    const { modelType, modelId } = req.params;
    const limit = req.query.limit || 10;

    const logs = await ActivityLog.getByModel(modelType, modelId, limit);

    return successResponse(
      res,
      logs,
      `Activity logs for ${modelType}#${modelId} retrieved successfully`
    );
  } catch (error) {
    next(error);
  }
};

export const getLogsByAction = async (req, res, next) => {
  try {
    const { action } = req.params;
    const { page, limit, offset } = getPaginationParams(req);

    const logs = await ActivityLog.getByAction(action, limit, offset);
    const total = await ActivityLog.count({ action });

    return paginatedResponse(
      res,
      logs,
      page,
      limit,
      total,
      `${action} logs retrieved successfully`
    );
  } catch (error) {
    next(error);
  }
};

export const getStatistics = async (req, res, next) => {
  try {
    const dateFrom =
      req.query.date_from || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
    const dateTo = req.query.date_to || new Date();

    const stats = await ActivityLog.getStatistics(dateFrom, dateTo);

    return successResponse(
      res,
      stats,
      "Activity statistics retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

export const createActivityLog = async (req, res, next) => {
  try {
    const data = {
      ...req.body,
      user_id: req.user.id,
      ip_address: req.ip,
      user_agent: req.get("user-agent"),
    };

    const log = await ActivityLog.create(data);
    return successResponse(res, log, "Activity log created successfully", 201);
  } catch (error) {
    next(error);
  }
};

// Cleanup old logs (admin only)
export const cleanupOldLogs = async (req, res, next) => {
  try {
    const days = req.body.days || 90; // Default 90 days

    await ActivityLog.deleteOlderThan(days);
    return successResponse(
      res,
      null,
      `Logs older than ${days} days deleted successfully`
    );
  } catch (error) {
    next(error);
  }
};

export const deleteActivityLog = async (req, res, next) => {
  try {
    const { id } = req.params;

    const log = await ActivityLog.findById(id);
    if (!log) {
      return errorResponse(res, "Activity log not found", 404);
    }

    await ActivityLog.delete(id);
    return successResponse(res, null, "Activity log deleted successfully");
  } catch (error) {
    next(error);
  }
};
