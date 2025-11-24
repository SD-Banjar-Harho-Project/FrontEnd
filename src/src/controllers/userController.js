import User from "../models/User.js";
import bcrypt from "bcryptjs";
import {
  successResponse,
  errorResponse,
  paginatedResponse,
} from "../utils/responseHelper.js";
import { getPaginationParams } from "../utils/pagination.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const { page, limit, offset } = getPaginationParams(req);
    const search = req.query.search || "";

    let users, total;

    if (search) {
      users = await User.search(search, limit, offset);
      total = users.length;
    } else {
      users = await User.findAll(limit, offset);
      total = await User.count();
    }

    users.forEach((user) => {
      delete user.password_hash;
      delete user.remember_token;
    });

    return paginatedResponse(
      res,
      users,
      page,
      limit,
      total,
      "Users retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    delete user.password_hash;
    delete user.remember_token;

    return successResponse(res, user, "User retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const {
      username,
      email,
      password,
      full_name,
      phone,
      role_id,
      avatar,
      is_active,
    } = req.body;

    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return errorResponse(res, "Username already exists", 409);
    }

    const existingEmail = await User.findByEmail(email);
    if (existingEmail) {
      return errorResponse(res, "Email already exists", 409);
    }

    const password_hash = await bcrypt.hash(password, 10);

    const userData = {
      username,
      email,
      password_hash,
      full_name,
      phone,
      role_id,
      avatar,
      is_active: is_active !== undefined ? is_active : 1,
    };

    const user = await User.create(userData);

    delete user.password_hash;
    delete user.remember_token;

    return successResponse(res, user, "User created successfully", 201);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { email, full_name, phone, role_id, avatar, is_active } = req.body;

    const existingUser = await User.findById(id);
    if (!existingUser) {
      return errorResponse(res, "User not found", 404);
    }

    const userData = {
      email,
      full_name,
      phone,
      role_id,
      avatar,
      is_active,
    };

    const user = await User.update(id, userData);

    delete user.password_hash;
    delete user.remember_token;

    return successResponse(res, user, "User updated successfully");
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    await User.delete(id);

    return successResponse(res, null, "User deleted successfully");
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { new_password } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    const password_hash = await bcrypt.hash(new_password, 10);
    await User.updatePassword(id, password_hash);

    return successResponse(res, null, "Password reset successfully");
  } catch (error) {
    next(error);
  }
};

// Get deleted users
export const getDeletedUsers = async (req, res, next) => {
  try {
    const { page, limit, offset } = getPaginationParams(req);

    const users = await User.findDeleted(limit, offset);
    const total = await User.countDeleted();

    return paginatedResponse(
      res,
      users,
      page,
      limit,
      total,
      "Deleted users retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

// Restore deleted user
export const restoreUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.restore(id);

    if (!user) {
      return errorResponse(res, "User not found or already active", 404);
    }

    return successResponse(res, user, "User restored successfully");
  } catch (error) {
    next(error);
  }
};
