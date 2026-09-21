import * as authService from '../services/auth.service.js';
import { apiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';

// GET /api/auth/me
export const getMe = asyncHandler(async (req, res) => {
  const profile = await authService.getProfile(req.user.id);
  return apiResponse(res, 200, profile);
});

// PATCH /api/auth/me — updates name + profile_data only
export const updateMe = asyncHandler(async (req, res) => {
  const { name, profile_data } = req.body;

  if (name === undefined && profile_data === undefined) {
    throw new ApiError(400, 'Nothing to update — provide name and/or profile_data');
  }

  const updated = await authService.updateProfile(req.user.id, { name, profile_data });
  return apiResponse(res, 200, updated, 'Profile updated');
});