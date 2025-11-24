import MediaLibrary from "../models/MediaLibrary.js";
import {
  successResponse,
  errorResponse,
  paginatedResponse,
} from "../utils/responseHelper.js";
import { getPaginationParams } from "../utils/pagination.js";

export const getAllMediaLibrary = async (req, res, next) => {
  try {
    const { page, limit, offset } = getPaginationParams(req);
    const filters = {
      file_type: req.query.file_type,
      mime_type: req.query.mime_type,
      search: req.query.search,
    };

    const items = await MediaLibrary.findAll(limit, offset, filters);
    const total = await MediaLibrary.count(filters);
    return paginatedResponse(
      res,
      items,
      page,
      limit,
      total,
      "Media library retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

export const getMediaLibraryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const media = await MediaLibrary.findById(id);
    if (!media) {
      return errorResponse(res, "Media not found", 404);
    }
    return successResponse(res, media, "Media retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const getMediaByType = async (req, res, next) => {
  try {
    const { type } = req.params;
    const { page, limit, offset } = getPaginationParams(req);

    const items = await MediaLibrary.getByType(type, limit, offset);
    const total = await MediaLibrary.count({ file_type: type });

    return paginatedResponse(
      res,
      items,
      page,
      limit,
      total,
      `${type} media retrieved successfully`
    );
  } catch (error) {
    next(error);
  }
};

export const createMediaLibrary = async (req, res, next) => {
  try {
    const data = {
      ...req.body,
      uploaded_by: req.user.id,
    };

    const media = await MediaLibrary.create(data);
    return successResponse(res, media, "Media uploaded successfully", 201);
  } catch (error) {
    next(error);
  }
};

export const updateMediaLibrary = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = { ...req.body };

    const existing = await MediaLibrary.findById(id);
    if (!existing) {
      return errorResponse(res, "Media not found", 404);
    }

    const media = await MediaLibrary.update(id, data);
    return successResponse(res, media, "Media updated successfully");
  } catch (error) {
    next(error);
  }
};

export const deleteMediaLibrary = async (req, res, next) => {
  try {
    const { id } = req.params;

    const media = await MediaLibrary.findById(id);
    if (!media) {
      return errorResponse(res, "Media not found", 404);
    }

    // Check if media is being used
    if (media.used_count > 0) {
      return errorResponse(
        res,
        "Cannot delete media that is currently in use",
        400
      );
    }

    await MediaLibrary.delete(id);
    return successResponse(res, null, "Media deleted successfully");
  } catch (error) {
    next(error);
  }
};
