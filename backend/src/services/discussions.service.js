import { supabase } from '../config/supabaseClient.js';
import { ApiError } from '../utils/apiError.js';

export const createMessage = async (userId, problemId, message) => {
	const { data, error } = await supabase
		.from('discussions')
		.insert([{ user_id: userId, problem_id: problemId, message }])
		.select()
		.single();

	if (error) throw new ApiError(500, error.message);
	return data;
};

export const listMessages = async (problemId) => {
	const { data, error } = await supabase
		.from('discussions')
		.select('*')
		.eq('problem_id', problemId)
		.order('created_at', { ascending: true });

	if (error) throw new ApiError(500, error.message);
	return data;
};
