import * as discussionsService from '../services/discussions.service.js';
import { apiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';

export const createMessage = asyncHandler(async (req, res) => {
	const { problem_id, message } = req.body;

	if (!problem_id || !message?.trim()) {
		throw new ApiError(400, 'problem_id and message are required');
	}

	const discussion = await discussionsService.createMessage(
		req.user.id,
		problem_id,
		message.trim()
	);

	return apiResponse(res, 201, discussion, 'Message posted successfully');
});

export const listMessages = asyncHandler(async (req, res) => {
	const messages = await discussionsService.listMessages(req.params.problemId);
	return apiResponse(res, 200, messages);
});
