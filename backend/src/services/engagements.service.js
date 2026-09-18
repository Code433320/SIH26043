import { supabase } from '../config/supabaseClient.js';
import { ApiError } from '../utils/apiError.js';

export const createEngagement = async (industryId, payload) => {
	const { data, error } = await supabase
		.from('engagements')
		.insert([{ ...payload, industry_id: industryId }])
		.select()
		.single();

	if (error) throw new ApiError(500, error.message);
	return data;
};

export const listEngagements = async (filters = {}) => {
	let query = supabase.from('engagements').select('*').order('created_at', { ascending: false });

	if (filters.industry_id) query = query.eq('industry_id', filters.industry_id);
	if (filters.solution_id) query = query.eq('solution_id', filters.solution_id);
	if (filters.status) query = query.eq('status', filters.status);

	const { data, error } = await query;
	if (error) throw new ApiError(500, error.message);
	return data;
};

export const getEngagementById = async (id) => {
	const { data, error } = await supabase.from('engagements').select('*').eq('id', id).single();
	if (error) throw new ApiError(404, 'Engagement not found');
	return data;
};

export const updateEngagementStatus = async (id, status) => {
	const { data, error } = await supabase
		.from('engagements')
		.update({ status, updated_at: new Date().toISOString() })
		.eq('id', id)
		.select()
		.single();

	if (error) throw new ApiError(500, error.message);
	return data;
};
