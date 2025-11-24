import Setting from "../models/Setting.js";
import pool from "../config/database.js"; // TAMBAHKAN INI
import { successResponse, errorResponse } from "../utils/responseHelper.js";

// GET all settings
export const getAllSettings = async (req, res, next) => {
  try {
    const settings = await Setting.getAll();
    return successResponse(res, settings, "Settings retrieved successfully");
  } catch (error) {
    next(error);
  }
};

// GET settings by group
export const getSettingsByGroup = async (req, res, next) => {
  try {
    const { group } = req.params;
    const settings = await Setting.getByGroup(group);

    if (!settings || settings.length === 0) {
      return errorResponse(res, `No settings found for group '${group}'`, 404);
    }

    return successResponse(res, settings, "Settings retrieved successfully");
  } catch (error) {
    next(error);
  }
};

// GET public settings (untuk frontend tanpa auth)
export const getPublicSettings = async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      "SELECT key_name, key_value, data_type FROM settings WHERE is_public = 1"
    );

    const settings = {};
    rows.forEach((row) => {
      let value = row.key_value;

      switch (row.data_type) {
        case "boolean":
          value = value === "true" || value === "1";
          break;
        case "number":
          value = Number(value);
          break;
        case "json":
          try {
            value = JSON.parse(value);
          } catch {}
          break;
      }

      settings[row.key_name] = value;
    });

    return successResponse(
      res,
      settings,
      "Public settings retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

// UPDATE single setting by key
export const updateSettingByKey = async (req, res, next) => {
  try {
    const { key } = req.params;
    const { key_value } = req.body;

    if (key_value === undefined) {
      return errorResponse(res, "key_value is required", 400);
    }

    const setting = await Setting.updateByKey(key, key_value);
    return successResponse(res, setting, "Setting updated successfully");
  } catch (error) {
    if (error.message.includes("not found")) {
      return errorResponse(res, error.message, 404);
    }
    next(error);
  }
};

// BULK UPDATE multiple settings
export const updateMultipleSettings = async (req, res, next) => {
  try {
    const settings = req.body;

    if (!settings || Object.keys(settings).length === 0) {
      return errorResponse(res, "No settings provided", 400);
    }

    // Cek apakah semua key ada di database
    const keys = Object.keys(settings);
    const placeholders = keys.map(() => "?").join(",");

    const [existingSettings] = await pool.execute(
      `SELECT key_name FROM settings WHERE key_name IN (${placeholders})`,
      keys
    );

    const existingKeys = existingSettings.map((s) => s.key_name);
    const missingKeys = keys.filter((k) => !existingKeys.includes(k));

    if (missingKeys.length > 0) {
      return errorResponse(
        res,
        `Settings not found: ${missingKeys.join(
          ", "
        )}. Please create them first or seed the settings table.`,
        404
      );
    }

    await Setting.updateMultiple(settings);
    const updated = await Setting.getAll();

    return successResponse(res, updated, "Settings updated successfully");
  } catch (error) {
    next(error);
  }
};
