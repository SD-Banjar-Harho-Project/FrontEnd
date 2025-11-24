import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/database.js"; // TAMBAHKAN INI
import User from "../models/User.js";
import { successResponse, errorResponse } from "../utils/responseHelper.js";

export const register = async (req, res, next) => {
  try {
    const { username, email, password, full_name, phone, role_id } = req.body;

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
      phone: phone || null,
      role_id: Number(role_id) || 5,
      avatar: null,
      is_active: 1,
    };

    const user = await User.create(userData);

    delete user.password_hash;
    delete user.remember_token;

    return successResponse(res, user, "User registered successfully", 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findByUsername(username);
    if (!user) {
      return errorResponse(res, "Invalid credentials", 401);
    }

    if (!user.is_active) {
      return errorResponse(res, "Account is inactive", 403);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return errorResponse(res, "Invalid credentials", 401);
    }

    // TAMBAHAN INI - Get role name from database
    const [roles] = await pool.execute("SELECT name FROM roles WHERE id = ?", [
      user.role_id,
    ]);
    const roleName = roles[0]?.name || "user";

    // Token sudah include role name
    const token = jwt.sign(
      {
        id: user.id, // UBAH dari userId jadi id
        userId: user.id, // Tetap ada untuk backward compatibility
        username: user.username,
        role_id: user.role_id,
        role: roleName, // TAMBAHAN INI
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    await User.updateLastLogin(user.id);

    delete user.password_hash;
    delete user.remember_token;

    return successResponse(
      res,
      {
        user: {
          ...user,
          role: roleName, // TAMBAHAN INI di response
        },
        token,
      },
      "Login successful"
    );
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    delete user.password_hash;
    delete user.remember_token;

    // TAMBAHAN - include role name
    const [roles] = await pool.execute("SELECT name FROM roles WHERE id = ?", [
      user.role_id,
    ]);
    const roleName = roles[0]?.name || "user";

    return successResponse(
      res,
      {
        ...user,
        role: roleName,
      },
      "Profile retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { email, full_name, phone, avatar } = req.body;

    const userData = {
      email,
      full_name,
      phone,
      avatar,
      role_id: req.user.role_id,
      is_active: req.user.is_active,
    };

    const user = await User.update(req.user.id, userData);

    delete user.password_hash;
    delete user.remember_token;

    return successResponse(res, user, "Profile updated successfully");
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { old_password, new_password } = req.body;

    const user = await User.findById(req.user.id);

    const isPasswordValid = await bcrypt.compare(
      old_password,
      user.password_hash
    );
    if (!isPasswordValid) {
      return errorResponse(res, "Current password is incorrect", 400);
    }

    const password_hash = await bcrypt.hash(new_password, 10);
    await User.updatePassword(req.user.id, password_hash);

    return successResponse(res, null, "Password changed successfully");
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    return successResponse(res, null, "Logout successful");
  } catch (error) {
    next(error);
  }
};
