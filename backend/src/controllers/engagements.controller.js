import * as engagementsService from '../services/engagements.service.js';
import { apiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';

export const createEngagement = asyncHandler(async (req, res) => {
	const { solution_id, type, amount, message } = req.body;

	if (!solution_id || !type) {
		throw new ApiError(400, 'solution_id and type are required');
	}

	if (!['funding', 'mentorship', 'field_support'].includes(type)) {
		throw new ApiError(400, 'type must be funding, mentorship or field_support');
	}

	const engagement = await engagementsService.createEngagement(req.user.id, {
		solution_id,
		type,
		amount: amount ?? null,
		message: message ?? null,
		status: 'pending',
	});

	return apiResponse(res, 201, engagement, 'Engagement created successfully');
});

export const listEngagements = asyncHandler(async (req, res) => {
	const { solution_id, status } = req.query;
	const engagements = await engagementsService.listEngagements({
		industry_id: req.user.id,
		solution_id,
		status,
	});
	return apiResponse(res, 200, engagements);
});

export const getEngagement = asyncHandler(async (req, res) => {
	const engagement = await engagementsService.getEngagementById(req.params.id);
	return apiResponse(res, 200, engagement);
});

export const updateStatus = asyncHandler(async (req, res) => {
	const { status } = req.body;
	if (!['pending', 'active', 'completed', 'rejected'].includes(status)) {
		throw new ApiError(400, 'Invalid engagement status');
	}

	const engagement = await engagementsService.updateEngagementStatus(req.params.id, status);
	return apiResponse(res, 200, engagement, 'Engagement status updated');
});
