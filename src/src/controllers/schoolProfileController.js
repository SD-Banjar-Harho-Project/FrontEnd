import SchoolProfile from '../models/SchoolProfile.js';
import { successResponse, errorResponse } from '../utils/responseHelper.js';

export const getSchoolProfile = async (req, res, next) => {
  try {
    const profile = await SchoolProfile.get();

    if (!profile) {
      return errorResponse(res, 'School profile not found', 404);
    }

    return successResponse(res, profile, 'School profile retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const updateSchoolProfile = async (req, res, next) => {
  try {
    const profileData = { ...req.body };

    const profile = await SchoolProfile.update(profileData);

    return successResponse(res, profile, 'School profile updated successfully');
  } catch (error) {
    next(error);
  }
};
