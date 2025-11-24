import Slider from "../models/Slider.js";
import {
  successResponse,
  errorResponse,
  paginatedResponse,
} from "../utils/responseHelper.js";
import { getPaginationParams } from "../utils/pagination.js";

export const getAllSliders = async (req, res, next) => {
  try {
    const { page, limit, offset } = getPaginationParams(req);
    const filters = {
      is_active: req.query.is_active,
      active_only: req.query.active_only === "true",
    };

    const items = await Slider.findAll(limit, offset, filters);
    const total = await Slider.count(filters);

    return paginatedResponse(
      res,
      items,
      page,
      limit,
      total,
      "Sliders retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

export const getActiveSliders = async (req, res, next) => {
  try {
    const sliders = await Slider.getActiveSliders();
    return successResponse(
      res,
      sliders,
      "Active sliders retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

export const getSliderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const slider = await Slider.findById(id);

    if (!slider) {
      return errorResponse(res, "Slider not found", 404);
    }

    return successResponse(res, slider, "Slider retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const getExpiredSliders = async (req, res, next) => {
  try {
    const sliders = await Slider.getExpiredSliders();
    return successResponse(
      res,
      sliders,
      "Expired sliders retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

export const getUpcomingSliders = async (req, res, next) => {
  try {
    const sliders = await Slider.getUpcomingSliders();
    return successResponse(
      res,
      sliders,
      "Upcoming sliders retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

export const createSlider = async (req, res, next) => {
  try {
    const data = { ...req.body };
    const slider = await Slider.create(data);

    return successResponse(res, slider, "Slider created successfully", 201);
  } catch (error) {
    next(error);
  }
};

export const updateSlider = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = { ...req.body };

    const existing = await Slider.findById(id);
    if (!existing) {
      return errorResponse(res, "Slider not found", 404);
    }

    const slider = await Slider.update(id, data);
    return successResponse(res, slider, "Slider updated successfully");
  } catch (error) {
    next(error);
  }
};

export const toggleActive = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await Slider.findById(id);
    if (!existing) {
      return errorResponse(res, "Slider not found", 404);
    }

    const slider = await Slider.toggleActive(id);
    return successResponse(res, slider, "Slider status toggled successfully");
  } catch (error) {
    next(error);
  }
};

export const updateOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { display_order } = req.body;

    if (display_order === undefined) {
      return errorResponse(res, "display_order is required", 400);
    }

    const existing = await Slider.findById(id);
    if (!existing) {
      return errorResponse(res, "Slider not found", 404);
    }

    const slider = await Slider.updateOrder(id, display_order);
    return successResponse(res, slider, "Slider order updated successfully");
  } catch (error) {
    next(error);
  }
};

export const deleteSlider = async (req, res, next) => {
  try {
    const { id } = req.params;

    const slider = await Slider.findById(id);
    if (!slider) {
      return errorResponse(res, "Slider not found", 404);
    }

    await Slider.delete(id);
    return successResponse(res, null, "Slider deleted successfully");
  } catch (error) {
    next(error);
  }
};
