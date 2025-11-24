import SeoMetadata from '../models/SeoMetadata.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/responseHelper.js';
import { getPaginationParams } from '../utils/pagination.js';

export const getAllSeoMetadatas = async (req, res, next) => {
  try {
    const { page, limit, offset } = getPaginationParams(req);
    const items = await SeoMetadata.findAll(limit, offset);
    const total = await SeoMetadata.count();
    return paginatedResponse(res, items, page, limit, total, 'SeoMetadatas retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getSeoMetadataById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const seoMetadata = await SeoMetadata.findById(id);
    if (!seoMetadata) {
      return errorResponse(res, 'SeoMetadata not found', 404);
    }
    return successResponse(res, seoMetadata, 'SeoMetadata retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const createSeoMetadata = async (req, res, next) => {
  try {
    const data = { ...req.body };
    const seoMetadata = await SeoMetadata.create(data);
    return successResponse(res, seoMetadata, 'SeoMetadata created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const updateSeoMetadata = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = { ...req.body };
    const existing = await SeoMetadata.findById(id);
    if (!existing) {
      return errorResponse(res, 'SeoMetadata not found', 404);
    }
    const seoMetadata = await SeoMetadata.update(id, data);
    return successResponse(res, seoMetadata, 'SeoMetadata updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteSeoMetadata = async (req, res, next) => {
  try {
    const { id } = req.params;
    const seoMetadata = await SeoMetadata.findById(id);
    if (!seoMetadata) {
      return errorResponse(res, 'SeoMetadata not found', 404);
    }
    await SeoMetadata.delete(id);
    return successResponse(res, null, 'SeoMetadata deleted successfully');
  } catch (error) {
    next(error);
  }
};
