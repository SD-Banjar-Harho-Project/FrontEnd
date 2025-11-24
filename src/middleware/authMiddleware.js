import jwt from "jsonwebtoken";
import { errorResponse } from "../utils/responseHelper.js";
import User from "../models/User.js";
import pool from "../config/database.js"; // TAMBAHKAN INI

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return errorResponse(res, "No token provided", 401);
    }

    const token = authHeader.substring(7);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId || decoded.id);

    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    if (!user.is_active) {
      return errorResponse(res, "User account is inactive", 403);
    }

    // TAMBAHKAN role dari token ke req.user
    req.user = {
      ...user,
      role: decoded.role, // AMBIL DARI TOKEN
    };

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return errorResponse(res, "Token expired", 401);
    }
    if (error.name === "JsonWebTokenError") {
      return errorResponse(res, "Invalid token", 401);
    }
    next(error);
  }
};

export const authorize = (...roles) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return errorResponse(res, "Authentication required", 401);
      }

      console.log("User role:", req.user.role); // DEBUG
      console.log("Allowed roles:", roles); // DEBUG

      // Gunakan role yang sudah ada di req.user (dari token)
      if (!roles.includes(req.user.role)) {
        return errorResponse(
          res,
          "Access denied. Insufficient permissions.",
          403
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId || decoded.id);

      if (user && user.is_active) {
        req.user = {
          ...user,
          role: decoded.role,
        };
      }
    }

    next();
  } catch (error) {
    next();
  }
};
