import Complaint from "../models/Complaint.js";
import {
  successResponse,
  errorResponse,
  paginatedResponse,
} from "../utils/responseHelper.js";
import { getPaginationParams } from "../utils/pagination.js";

export const getAllComplaints = async (req, res, next) => {
  try {
    const { page, limit, offset } = getPaginationParams(req);
    const filters = {
      status: req.query.status,
      category: req.query.category,
      priority: req.query.priority,
      assigned_to: req.query.assigned_to,
      search: req.query.search,
    };

    const items = await Complaint.findAll(limit, offset, filters);
    const total = await Complaint.count(filters);

    return paginatedResponse(
      res,
      items,
      page,
      limit,
      total,
      "Complaints retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

export const getComplaintById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return errorResponse(res, "Complaint not found", 404);
    }

    return successResponse(res, complaint, "Complaint retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const getComplaintsByStatus = async (req, res, next) => {
  try {
    const { status } = req.params;
    const { page, limit, offset } = getPaginationParams(req);

    const complaints = await Complaint.getByStatus(status, limit, offset);
    const total = await Complaint.countByStatus(status);

    return paginatedResponse(
      res,
      complaints,
      page,
      limit,
      total,
      `${status} complaints retrieved successfully`
    );
  } catch (error) {
    next(error);
  }
};

export const createComplaint = async (req, res, next) => {
  try {
    const data = {
      ...req.body,
      ip_address: req.ip,
      user_agent: req.get("user-agent"),
    };

    const complaint = await Complaint.create(data);
    return successResponse(
      res,
      complaint,
      "Complaint submitted successfully",
      201
    );
  } catch (error) {
    next(error);
  }
};

export const updateComplaint = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = { ...req.body };

    const existing = await Complaint.findById(id);
    if (!existing) {
      return errorResponse(res, "Complaint not found", 404);
    }

    const complaint = await Complaint.update(id, data);
    return successResponse(res, complaint, "Complaint updated successfully");
  } catch (error) {
    next(error);
  }
};

export const assignComplaint = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { assigned_to } = req.body;

    const existing = await Complaint.findById(id);
    if (!existing) {
      return errorResponse(res, "Complaint not found", 404);
    }

    const complaint = await Complaint.assign(id, assigned_to);
    return successResponse(res, complaint, "Complaint assigned successfully");
  } catch (error) {
    next(error);
  }
};

export const resolveComplaint = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { resolution_note } = req.body;

    const existing = await Complaint.findById(id);
    if (!existing) {
      return errorResponse(res, "Complaint not found", 404);
    }

    const complaint = await Complaint.resolve(id, resolution_note, req.user.id);
    return successResponse(res, complaint, "Complaint resolved successfully");
  } catch (error) {
    next(error);
  }
};

export const updateComplaintStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const existing = await Complaint.findById(id);
    if (!existing) {
      return errorResponse(res, "Complaint not found", 404);
    }

    const complaint = await Complaint.updateStatus(id, status, req.user.id);
    return successResponse(
      res,
      complaint,
      "Complaint status updated successfully"
    );
  } catch (error) {
    next(error);
  }
};

export const deleteComplaint = async (req, res, next) => {
  try {
    const { id } = req.params;

    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return errorResponse(res, "Complaint not found", 404);
    }

    await Complaint.delete(id);
    return successResponse(res, null, "Complaint deleted successfully");
  } catch (error) {
    next(error);
  }
};
