import Teacher from "../models/Teacher.js";
import {
  successResponse,
  errorResponse,
  paginatedResponse,
} from "../utils/responseHelper.js";
import { getPaginationParams } from "../utils/pagination.js";

export const getAllTeachers = async (req, res, next) => {
  try {
    const { page, limit, offset } = getPaginationParams(req);

    const teachers = await Teacher.findAll(limit, offset);
    const total = await Teacher.count();

    return paginatedResponse(
      res,
      teachers,
      page,
      limit,
      total,
      "Teachers retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

export const getTeacherById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findById(id);

    if (!teacher) {
      return errorResponse(res, "Teacher not found", 404);
    }

    return successResponse(res, teacher, "Teacher retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const createTeacher = async (req, res, next) => {
  try {
    const teacherData = { ...req.body };

    if (teacherData.nip) {
      const existing = await Teacher.findByNip(teacherData.nip);
      if (existing) {
        return errorResponse(res, "NIP already exists", 409);
      }
    }

    const teacher = await Teacher.create(teacherData);

    return successResponse(res, teacher, "Teacher created successfully", 201);
  } catch (error) {
    next(error);
  }
};

export const updateTeacher = async (req, res, next) => {
  try {
    const { id } = req.params;
    const teacherData = { ...req.body };

    const existing = await Teacher.findById(id);
    if (!existing) {
      return errorResponse(res, "Teacher not found", 404);
    }

    const teacher = await Teacher.update(id, teacherData);

    return successResponse(res, teacher, "Teacher updated successfully");
  } catch (error) {
    next(error);
  }
};

export const deleteTeacher = async (req, res, next) => {
  try {
    const { id } = req.params;

    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return errorResponse(res, "Teacher not found", 404);
    }

    await Teacher.delete(id);

    return successResponse(res, null, "Teacher deleted successfully");
  } catch (error) {
    next(error);
  }
};

// Get deleted teachers
export const getDeletedTeachers = async (req, res, next) => {
  try {
    const { page, limit, offset } = getPaginationParams(req);

    const teachers = await Teacher.findDeleted(limit, offset);
    const total = await Teacher.countDeleted();

    return paginatedResponse(
      res,
      teachers,
      page,
      limit,
      total,
      "Deleted teachers retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

// Restore deleted teacher
export const restoreTeacher = async (req, res, next) => {
  try {
    const { id } = req.params;

    const teacher = await Teacher.restore(id);

    if (!teacher) {
      return errorResponse(res, "Teacher not found or already active", 404);
    }

    return successResponse(res, teacher, "Teacher restored successfully");
  } catch (error) {
    next(error);
  }
};
