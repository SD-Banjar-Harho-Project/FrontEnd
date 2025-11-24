import ContactMessage from "../models/ContactMessage.js";
import {
  successResponse,
  errorResponse,
  paginatedResponse,
} from "../utils/responseHelper.js";
import { getPaginationParams } from "../utils/pagination.js";

export const getAllContactMessages = async (req, res, next) => {
  try {
    const { page, limit, offset } = getPaginationParams(req);
    const filters = {
      status: req.query.status,
      search: req.query.search,
    };

    const items = await ContactMessage.findAll(limit, offset, filters);
    const total = await ContactMessage.count(filters);

    return paginatedResponse(
      res,
      items,
      page,
      limit,
      total,
      "Contact messages retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

export const getContactMessageById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const message = await ContactMessage.findById(id);

    if (!message) {
      return errorResponse(res, "Contact message not found", 404);
    }

    // Auto mark as read when viewed
    if (message.status === "new") {
      await ContactMessage.markAsRead(id);
    }

    return successResponse(
      res,
      message,
      "Contact message retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

export const getMessagesByStatus = async (req, res, next) => {
  try {
    const { status } = req.params;
    const { page, limit, offset } = getPaginationParams(req);

    const messages = await ContactMessage.getByStatus(status, limit, offset);
    const total = await ContactMessage.countByStatus(status);

    return paginatedResponse(
      res,
      messages,
      page,
      limit,
      total,
      `${status} messages retrieved successfully`
    );
  } catch (error) {
    next(error);
  }
};

export const getUnreadCount = async (req, res, next) => {
  try {
    const count = await ContactMessage.getUnreadCount();
    return successResponse(
      res,
      { unread_count: count },
      "Unread count retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

export const createContactMessage = async (req, res, next) => {
  try {
    const data = {
      ...req.body,
      ip_address: req.ip,
      user_agent: req.get("user-agent"),
    };

    const message = await ContactMessage.create(data);
    return successResponse(res, message, "Message sent successfully", 201);
  } catch (error) {
    next(error);
  }
};

export const updateContactMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = { ...req.body };

    const existing = await ContactMessage.findById(id);
    if (!existing) {
      return errorResponse(res, "Contact message not found", 404);
    }

    const message = await ContactMessage.update(id, data);
    return successResponse(res, message, "Message updated successfully");
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await ContactMessage.findById(id);
    if (!existing) {
      return errorResponse(res, "Contact message not found", 404);
    }

    const message = await ContactMessage.markAsRead(id);
    return successResponse(res, message, "Message marked as read");
  } catch (error) {
    next(error);
  }
};

export const replyMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reply_message } = req.body;

    if (!reply_message) {
      return errorResponse(res, "Reply message is required", 400);
    }

    const existing = await ContactMessage.findById(id);
    if (!existing) {
      return errorResponse(res, "Contact message not found", 404);
    }

    const message = await ContactMessage.reply(id, reply_message, req.user.id);
    return successResponse(res, message, "Reply sent successfully");
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return errorResponse(res, "Status is required", 400);
    }

    const existing = await ContactMessage.findById(id);
    if (!existing) {
      return errorResponse(res, "Contact message not found", 404);
    }

    const message = await ContactMessage.updateStatus(id, status);
    return successResponse(res, message, "Status updated successfully");
  } catch (error) {
    next(error);
  }
};

export const deleteContactMessage = async (req, res, next) => {
  try {
    const { id } = req.params;

    const message = await ContactMessage.findById(id);
    if (!message) {
      return errorResponse(res, "Contact message not found", 404);
    }

    await ContactMessage.delete(id);
    return successResponse(res, null, "Message deleted successfully");
  } catch (error) {
    next(error);
  }
};
