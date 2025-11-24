import MenuItem from '../models/MenuItem.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/responseHelper.js';
import { getPaginationParams } from '../utils/pagination.js';

export const getAllMenuItems = async (req, res, next) => {
  try {
    const { page, limit, offset } = getPaginationParams(req);
    const items = await MenuItem.findAll(limit, offset);
    const total = await MenuItem.count();
    return paginatedResponse(res, items, page, limit, total, 'MenuItems retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getMenuItemById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const menuItem = await MenuItem.findById(id);
    if (!menuItem) {
      return errorResponse(res, 'MenuItem not found', 404);
    }
    return successResponse(res, menuItem, 'MenuItem retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const createMenuItem = async (req, res, next) => {
  try {
    const data = { ...req.body };
    const menuItem = await MenuItem.create(data);
    return successResponse(res, menuItem, 'MenuItem created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const updateMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = { ...req.body };
    const existing = await MenuItem.findById(id);
    if (!existing) {
      return errorResponse(res, 'MenuItem not found', 404);
    }
    const menuItem = await MenuItem.update(id, data);
    return successResponse(res, menuItem, 'MenuItem updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const menuItem = await MenuItem.findById(id);
    if (!menuItem) {
      return errorResponse(res, 'MenuItem not found', 404);
    }
    await MenuItem.delete(id);
    return successResponse(res, null, 'MenuItem deleted successfully');
  } catch (error) {
    next(error);
  }
};
