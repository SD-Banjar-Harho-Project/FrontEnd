import Notification from "../models/Notification.js";
import {
  successResponse,
  errorResponse,
  paginatedResponse,
} from "../utils/responseHelper.js";
import { getPaginationParams } from "../utils/pagination.js";

export const getAllNotifications = async (req, res, next) => {
  try {
    const { page, limit, offset } = getPaginationParams(req);
    const filters = {
      user_id: req.query.user_id,
      type: req.query.type,
      is_read: req.query.is_read,
    };

    const items = await Notification.findAll(limit, offset, filters);
    const total = await Notification.count(filters);

    return paginatedResponse(
      res,
      items,
      page,
      limit,
      total,
      "Notifications retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

export const getMyNotifications = async (req, res, next) => {
  try {
    const { page, limit, offset } = getPaginationParams(req);
    const userId = req.user.id;

    const notifications = await Notification.findByUserId(
      userId,
      limit,
      offset
    );
    const total = await Notification.count({ user_id: userId });

    return paginatedResponse(
      res,
      notifications,
      page,
      limit,
      total,
      "Your notifications retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

export const getUnreadNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const limit = req.query.limit || 10;

    const notifications = await Notification.getUnreadByUser(userId, limit);
    const count = await Notification.countUnreadByUser(userId);

    return successResponse(
      res,
      { notifications, unread_count: count },
      "Unread notifications retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

export const getUnreadCount = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const count = await Notification.countUnreadByUser(userId);

    return successResponse(
      res,
      { unread_count: count },
      "Unread count retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

export const getNotificationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findById(id);

    if (!notification) {
      return errorResponse(res, "Notification not found", 404);
    }

    // Auto mark as read when viewed
    if (!notification.is_read && notification.user_id === req.user.id) {
      await Notification.markAsRead(id);
    }

    return successResponse(
      res,
      notification,
      "Notification retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

export const createNotification = async (req, res, next) => {
  try {
    const data = { ...req.body };
    const notification = await Notification.create(data);

    return successResponse(
      res,
      notification,
      "Notification created successfully",
      201
    );
  } catch (error) {
    next(error);
  }
};

export const createBroadcastNotification = async (req, res, next) => {
  try {
    const data = { ...req.body };
    const result = await Notification.createForAllUsers(data);

    return successResponse(
      res,
      result,
      `Notification sent to ${result.count} users`,
      201
    );
  } catch (error) {
    next(error);
  }
};

export const updateNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = { ...req.body };

    const existing = await Notification.findById(id);
    if (!existing) {
      return errorResponse(res, "Notification not found", 404);
    }

    const notification = await Notification.update(id, data);
    return successResponse(
      res,
      notification,
      "Notification updated successfully"
    );
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await Notification.findById(id);
    if (!existing) {
      return errorResponse(res, "Notification not found", 404);
    }

    // Check if user owns this notification
    if (existing.user_id !== req.user.id) {
      return errorResponse(res, "Unauthorized", 403);
    }

    const notification = await Notification.markAsRead(id);
    return successResponse(res, notification, "Notification marked as read");
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (req, res, next) => {
  try {
    const userId = req.user.id;
    await Notification.markAllAsRead(userId);

    return successResponse(res, null, "All notifications marked as read");
  } catch (error) {
    next(error);
  }
};

export const deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findById(id);
    if (!notification) {
      return errorResponse(res, "Notification not found", 404);
    }

    // Check if user owns this notification or is admin
    if (
      notification.user_id !== req.user.id &&
      !["admin", "superadmin"].includes(req.user.role)
    ) {
      return errorResponse(res, "Unauthorized", 403);
    }

    await Notification.delete(id);
    return successResponse(res, null, "Notification deleted successfully");
  } catch (error) {
    next(error);
  }
};
