import Gallery from "../models/Gallery.js";
import {
  successResponse,
  errorResponse,
  paginatedResponse,
} from "../utils/responseHelper.js";
import { getPaginationParams } from "../utils/pagination.js";

export const getAllGalleries = async (req, res, next) => {
  try {
    const { page, limit, offset } = getPaginationParams(req);
    const galleries = await Gallery.findAll(limit, offset);
    const total = await Gallery.count();
    return paginatedResponse(
      res,
      galleries,
      page,
      limit,
      total,
      "Galleries retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

export const getGalleryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const gallery = await Gallery.findWithItems(id);
    if (!gallery) {
      return errorResponse(res, "Gallery not found", 404);
    }
    return successResponse(res, gallery, "Gallery retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const createGallery = async (req, res, next) => {
  try {
    const galleryData = { ...req.body, author_id: req.user.id };
    const gallery = await Gallery.create(galleryData);
    return successResponse(res, gallery, "Gallery created successfully", 201);
  } catch (error) {
    next(error);
  }
};

export const updateGallery = async (req, res, next) => {
  try {
    const { id } = req.params;
    const galleryData = { ...req.body };
    const existing = await Gallery.findById(id);
    if (!existing) {
      return errorResponse(res, "Gallery not found", 404);
    }
    const gallery = await Gallery.update(id, galleryData);
    return successResponse(res, gallery, "Gallery updated successfully");
  } catch (error) {
    next(error);
  }
};

export const deleteGallery = async (req, res, next) => {
  try {
    const { id } = req.params;
    const gallery = await Gallery.findById(id);
    if (!gallery) {
      return errorResponse(res, "Gallery not found", 404);
    }
    await Gallery.delete(id);
    return successResponse(res, null, "Gallery deleted successfully");
  } catch (error) {
    next(error);
  }
};

// Get deleted galleries
export const getDeletedGalleries = async (req, res, next) => {
  try {
    const { page, limit, offset } = getPaginationParams(req);

    const galleries = await Gallery.findDeleted(limit, offset);
    const total = await Gallery.countDeleted();

    return paginatedResponse(
      res,
      galleries,
      page,
      limit,
      total,
      "Deleted galleries retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

// Restore deleted gallery
export const restoreGallery = async (req, res, next) => {
  try {
    const { id } = req.params;

    const gallery = await Gallery.restore(id);

    if (!gallery) {
      return errorResponse(res, "Gallery not found or already active", 404);
    }

    return successResponse(res, gallery, "Gallery restored successfully");
  } catch (error) {
    next(error);
  }
};
