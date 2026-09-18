import { supabase } from '../config/supabaseClient.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Verifies the Supabase JWT sent from the frontend and attaches
// the authenticated user to req.user for downstream handlers.
export const requireAuth = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization; // expected: "Bearer <token>"
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    throw new ApiError(401, 'No token provided');
  }

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data?.user) {
    throw new ApiError(401, 'Invalid or expired token');
  }

  req.user = data.user; // req.user.id, req.user.email, etc.
  next();
});
