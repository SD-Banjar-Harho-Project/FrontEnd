import Page from "../models/Page.js";
import {
  successResponse,
  errorResponse,
  paginatedResponse,
} from "../utils/responseHelper.js";
import { getPaginationParams } from "../utils/pagination.js";

export const getAllPages = async (req, res, next) => {
  try {
    const { page, limit, offset } = getPaginationParams(req);
    const filters = {
      status: req.query.status,
      search: req.query.search,
    };
    const pages = await Page.findAll(limit, offset, filters);
    const total = await Page.count(filters);
    return paginatedResponse(
      res,
      pages,
      page,
      limit,
      total,
      "Pages retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

export const getPageById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const page = await Page.findById(id);
    if (!page) {
      return errorResponse(res, "Page not found", 404);
    }
    return successResponse(res, page, "Page retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const getPageBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const page = await Page.findBySlug(slug);
    if (!page) {
      return errorResponse(res, "Page not found", 404);
    }
    return successResponse(res, page, "Page retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const createPage = async (req, res, next) => {
  try {
    const pageData = { ...req.body, author_id: req.user.id };

    // Auto-generate slug if not provided
    if (!pageData.slug) {
      pageData.slug = pageData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    }

    const page = await Page.create(pageData);
    return successResponse(res, page, "Page created successfully", 201);
  } catch (error) {
    next(error);
  }
};

export const updatePage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const pageData = { ...req.body };

    const existing = await Page.findById(id);
    if (!existing) {
      return errorResponse(res, "Page not found", 404);
    }

    const page = await Page.update(id, pageData);
    return successResponse(res, page, "Page updated successfully");
  } catch (error) {
    next(error);
  }
};

export const deletePage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const page = await Page.findById(id);
    if (!page) {
      return errorResponse(res, "Page not found", 404);
    }
    await Page.delete(id);
    return successResponse(res, null, "Page deleted successfully");
  } catch (error) {
    next(error);
  }
};

// Get deleted pages
export const getDeletedPages = async (req, res, next) => {
  try {
    const { page, limit, offset } = getPaginationParams(req);

    const pages = await Page.findDeleted(limit, offset);
    const total = await Page.countDeleted();

    return paginatedResponse(
      res,
      pages,
      page,
      limit,
      total,
      "Deleted pages retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

// Restore deleted page
export const restorePage = async (req, res, next) => {
  try {
    const { id } = req.params;

    const page = await Page.restore(id);

    if (!page) {
      return errorResponse(res, "Page not found or already active", 404);
    }

    return successResponse(res, page, "Page restored successfully");
  } catch (error) {
    next(error);
  }
};
