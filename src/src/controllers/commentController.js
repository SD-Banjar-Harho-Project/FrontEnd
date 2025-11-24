import Comment from "../models/Comment.js";
import {
  successResponse,
  errorResponse,
  paginatedResponse,
} from "../utils/responseHelper.js";
import { getPaginationParams } from "../utils/pagination.js";

export const getAllComments = async (req, res, next) => {
  try {
    const { page, limit, offset } = getPaginationParams(req);
    const filters = {
      post_id: req.query.post_id,
      status: req.query.status,
      parent_id: req.query.parent_id,
    };

    const items = await Comment.findAll(limit, offset, filters);
    const total = await Comment.count(filters);

    return paginatedResponse(
      res,
      items,
      page,
      limit,
      total,
      "Comments retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

export const getCommentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findById(id);

    if (!comment) {
      return errorResponse(res, "Comment not found", 404);
    }

    return successResponse(res, comment, "Comment retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const getCommentsByPost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { page, limit, offset } = getPaginationParams(req);

    const comments = await Comment.findByPostId(postId, limit, offset);
    const total = await Comment.count({ post_id: postId, status: "approved" });

    return paginatedResponse(
      res,
      comments,
      page,
      limit,
      total,
      "Comments retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

export const getCommentReplies = async (req, res, next) => {
  try {
    const { id } = req.params;
    const replies = await Comment.findReplies(id);

    return successResponse(res, replies, "Replies retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const createComment = async (req, res, next) => {
  try {
    const data = {
      ...req.body,
      user_id: req.user ? req.user.id : null, // If logged in
      ip_address: req.ip,
      user_agent: req.get("user-agent"),
    };

    const comment = await Comment.create(data);
    return successResponse(res, comment, "Comment created successfully", 201);
  } catch (error) {
    next(error);
  }
};

export const updateComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = { ...req.body };

    const existing = await Comment.findById(id);
    if (!existing) {
      return errorResponse(res, "Comment not found", 404);
    }

    const comment = await Comment.update(id, data);
    return successResponse(res, comment, "Comment updated successfully");
  } catch (error) {
    next(error);
  }
};

export const approveComment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await Comment.findById(id);
    if (!existing) {
      return errorResponse(res, "Comment not found", 404);
    }

    const comment = await Comment.updateStatus(id, "approved");
    return successResponse(res, comment, "Comment approved successfully");
  } catch (error) {
    next(error);
  }
};

export const rejectComment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await Comment.findById(id);
    if (!existing) {
      return errorResponse(res, "Comment not found", 404);
    }

    const comment = await Comment.updateStatus(id, "spam");
    return successResponse(res, comment, "Comment rejected successfully");
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);
    if (!comment) {
      return errorResponse(res, "Comment not found", 404);
    }

    await Comment.delete(id);
    return successResponse(res, null, "Comment deleted successfully");
  } catch (error) {
    next(error);
  }
};
