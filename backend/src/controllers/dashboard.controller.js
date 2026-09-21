import { supabase } from '../config/supabaseClient.js';
import * as dashboardService from '../services/dashboard.service.js';
import { apiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';

// GET /api/dashboard/stats — role is looked up from public.users (not
// trusted from a query param), so nobody can request another role's stats.
export const getStats = asyncHandler(async (req, res) => {
  const { data: profile, error } = await supabase
    .from('users')
    .select('role')
    .eq('id', req.user.id)
    .single();

  if (error || !profile) {
    throw new ApiError(404, 'Profile not found');
  }

  let stats;
  switch (profile.role) {
    case 'citizen':
      stats = await dashboardService.getCitizenStats(req.user.id);
      break;
    case 'university':
    case 'student':
      stats = await dashboardService.getUniversityStats(req.user.id);
      break;
    case 'industry':
    case 'ngo':
      stats = await dashboardService.getIndustryStats(req.user.id);
      break;
    case 'government':
      stats = await dashboardService.getGovernmentStats();
      break;
    default:
      throw new ApiError(400, `No dashboard stats defined for role "${profile.role}"`);
  }

  return apiResponse(res, 200, stats);
});