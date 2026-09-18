import { supabase } from '../config/supabaseClient.js';
import { ApiError } from '../utils/apiError.js';

export const createSolution = async (authorId, payload) => {
	const { data, error } = await supabase
		.from('solutions')
		.insert([{ ...payload, university_id: authorId, submitted_by: authorId }])
		.select()
		.single();

	if (error) throw new ApiError(500, error.message);
	return data;
};

export const listSolutions = async (filters = {}) => {
	let query = supabase.from('solutions').select('*').order('created_at', { ascending: false });

	if (filters.problem_id) query = query.eq('problem_id', filters.problem_id);
	if (filters.university_id) query = query.eq('university_id', filters.university_id);
	if (filters.status) query = query.eq('status', filters.status);

	const { data, error } = await query;
	if (error) throw new ApiError(500, error.message);
	return data;
};

export const getSolutionById = async (id) => {
	const { data, error } = await supabase.from('solutions').select('*').eq('id', id).single();
	if (error) throw new ApiError(404, 'Solution not found');
	return data;
};

export const updateSolutionProgress = async (id, updates) => {
	const { data, error } = await supabase
		.from('solutions')
		.update(updates)
		.eq('id', id)
		.select()
		.single();

	if (error) throw new ApiError(500, error.message);
	return data;
};
