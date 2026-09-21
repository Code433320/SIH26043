import { supabase } from '../config/supabaseClient.js';
import { ApiError } from '../utils/apiError.js';

export const getProfile = async (userId) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !data) throw new ApiError(404, 'Profile not found');
  return data;
};

// Only allows updating name + profile_data — never role or email.
// Role changes shouldn't be self-service, and email changes go through
// Supabase Auth's own updateUser() flow, not this table.
export const updateProfile = async (userId, { name, profile_data }) => {
  const current = await getProfile(userId);

  // Merge instead of overwrite, so fields you don't send (like `institution`
  // from signup) don't get wiped out by a partial update.
  const mergedProfileData = {
    ...(current.profile_data || {}),
    ...(profile_data || {}),
  };

  const updates = {
    ...(name !== undefined ? { name } : {}),
    profile_data: mergedProfileData,
  };

  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw new ApiError(500, error.message);
  return data;
};