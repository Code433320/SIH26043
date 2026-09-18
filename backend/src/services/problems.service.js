import { supabase } from '../config/supabaseClient.js';
import { ApiError } from '../utils/apiError.js';

// CREATE — citizen submits a new problem
export const createProblem = async (citizenId, { title, description, location, category }) => {
  const { data, error } = await supabase
    .from('problems')
    .insert([
      {
        citizen_id: citizenId,
        title,
        description,
        location,
        category: category ?? null, // ML pipeline can fill this in later
        status: 'submitted',
      },
    ])
    .select()
    .single();

  if (error) throw new ApiError(500, error.message);
  return data;
};

// READ — single problem by id
export const getProblemById = async (id) => {
  const { data, error } = await supabase
    .from('problems')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw new ApiError(404, 'Problem not found');
  return data;
};

// READ — list problems, filterable by status / university_id / citizen_id
// Powers: citizen "My Reports", university "Find Problems", government "Monitor Projects"
export const listProblems = async (filters = {}) => {
  let query = supabase.from('problems').select('*').order('created_at', { ascending: false });

  if (filters.status) query = query.eq('status', filters.status);
  if (filters.university_id) query = query.eq('university_id', filters.university_id);
  if (filters.citizen_id) query = query.eq('citizen_id', filters.citizen_id);
  if (filters.category) query = query.eq('category', filters.category);

  const { data, error } = await query;

  if (error) throw new ApiError(500, error.message);
  return data;
};

// UPDATE — government verifies a problem's authenticity
export const verifyProblem = async (id) => {
  const { data, error } = await supabase
    .from('problems')
    .update({ status: 'verified' })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new ApiError(500, error.message);
  return data;
};

// UPDATE — used internally once ML analysis / university matching completes
export const updateProblemStatus = async (id, updates) => {
  const { data, error } = await supabase
    .from('problems')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new ApiError(500, error.message);
  return data;
};
