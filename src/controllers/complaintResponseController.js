import ComplaintResponse from "../models/ComplaintResponse.js";
import {
  successResponse,
  errorResponse,
  paginatedResponse,
} from "../utils/responseHelper.js";
import { getPaginationParams } from "../utils/pagination.js";

export const getAllComplaintResponses = async (req, res, next) => {
  try {
    const { page, limit, offset } = getPaginationParams(req);
    const filters = {
      complaint_id: req.query.complaint_id,
      user_id: req.query.user_id,
      is_internal: req.query.is_internal,
    };

    const items = await ComplaintResponse.findAll(limit, offset, filters);
    const total = await ComplaintResponse.count(filters);

    return paginatedResponse(
      res,
      items,
      page,
      limit,
      total,
      "Complaint responses retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

export const getComplaintResponseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const response = await ComplaintResponse.findById(id);

    if (!response) {
      return errorResponse(res, "Complaint response not found", 404);
    }

    return successResponse(
      res,
      response,
      "Complaint response retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

export const getResponsesByComplaint = async (req, res, next) => {
  try {
    const { complaintId } = req.params;
    const { page, limit, offset } = getPaginationParams(req);

    const responses = await ComplaintResponse.findByComplaintId(
      complaintId,
      limit,
      offset
    );
    const total = await ComplaintResponse.countByComplaint(complaintId);

    return paginatedResponse(
      res,
      responses,
      page,
      limit,
      total,
      "Responses retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

export const getPublicResponses = async (req, res, next) => {
  try {
    const { complaintId } = req.params;
    const responses = await ComplaintResponse.getPublicResponses(complaintId);

    return successResponse(
      res,
      responses,
      "Public responses retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

export const getInternalNotes = async (req, res, next) => {
  try {
    const { complaintId } = req.params;
    const notes = await ComplaintResponse.getInternalNotes(complaintId);

    return successResponse(res, notes, "Internal notes retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const createComplaintResponse = async (req, res, next) => {
  try {
    const data = {
      ...req.body,
      user_id: req.user.id,
    };

    const response = await ComplaintResponse.create(data);
    return successResponse(res, response, "Response created successfully", 201);
  } catch (error) {
    next(error);
  }
};

export const updateComplaintResponse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = { ...req.body };

    const existing = await ComplaintResponse.findById(id);
    if (!existing) {
      return errorResponse(res, "Complaint response not found", 404);
    }

    const response = await ComplaintResponse.update(id, data);
    return successResponse(res, response, "Response updated successfully");
  } catch (error) {
    next(error);
  }
};

export const deleteComplaintResponse = async (req, res, next) => {
  try {
    const { id } = req.params;

    const response = await ComplaintResponse.findById(id);
    if (!response) {
      return errorResponse(res, "Complaint response not found", 404);
    }

    await ComplaintResponse.delete(id);
    return successResponse(res, null, "Response deleted successfully");
  } catch (error) {
    next(error);
  }
};
