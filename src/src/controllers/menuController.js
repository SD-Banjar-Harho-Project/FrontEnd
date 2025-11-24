import Menu from "../models/Menu.js";
import {
  successResponse,
  errorResponse,
  paginatedResponse,
} from "../utils/responseHelper.js";
import { getPaginationParams } from "../utils/pagination.js";

export const getAllMenus = async (req, res, next) => {
  try {
    const { page, limit, offset } = getPaginationParams(req);
    const filters = {
      location: req.query.location,
      search: req.query.search,
    };

    const items = await Menu.findAll(limit, offset, filters);
    const total = await Menu.count(filters);

    return paginatedResponse(
      res,
      items,
      page,
      limit,
      total,
      "Menus retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

export const getMenuById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const menu = await Menu.findById(id);

    if (!menu) {
      return errorResponse(res, "Menu not found", 404);
    }

    return successResponse(res, menu, "Menu retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const getMenusByLocation = async (req, res, next) => {
  try {
    const { location } = req.params;
    const menus = await Menu.findByLocation(location);

    return successResponse(
      res,
      menus,
      `Menus for ${location} retrieved successfully`
    );
  } catch (error) {
    next(error);
  }
};

export const getLocations = async (req, res, next) => {
  try {
    const locations = await Menu.getLocations();
    return successResponse(
      res,
      locations,
      "Menu locations retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

export const createMenu = async (req, res, next) => {
  try {
    const data = { ...req.body };
    const menu = await Menu.create(data);

    return successResponse(res, menu, "Menu created successfully", 201);
  } catch (error) {
    if (error.message === "Menu name already exists") {
      return errorResponse(res, error.message, 409);
    }
    next(error);
  }
};

export const updateMenu = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = { ...req.body };

    const existing = await Menu.findById(id);
    if (!existing) {
      return errorResponse(res, "Menu not found", 404);
    }

    const menu = await Menu.update(id, data);
    return successResponse(res, menu, "Menu updated successfully");
  } catch (error) {
    if (error.message === "Menu name already exists") {
      return errorResponse(res, error.message, 409);
    }
    next(error);
  }
};

export const deleteMenu = async (req, res, next) => {
  try {
    const { id } = req.params;

    const menu = await Menu.findById(id);
    if (!menu) {
      return errorResponse(res, "Menu not found", 404);
    }

    await Menu.delete(id);
    return successResponse(res, null, "Menu deleted successfully");
  } catch (error) {
    next(error);
  }
};
