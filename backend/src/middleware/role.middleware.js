import { supabase } from '../config/supabaseClient.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Restricts a route to specific roles (citizen / university / industry / government).
// Must run AFTER requireAuth, since it relies on req.user being set.
export const requireRole = (allowedRoles) =>
  asyncHandler(async (req, res, next) => {
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', req.user.id)
      .single();

    if (error || !data) {
      throw new ApiError(403, 'Could not verify user role');
    }

    if (!allowedRoles.includes(data.role)) {
      throw new ApiError(403, 'You do not have permission to perform this action');
    }

    req.userRole = data.role;
    next();
  });
