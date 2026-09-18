import * as solutionsService from '../services/solutions.service.js';
import { apiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';

export const createSolution = asyncHandler(async (req, res) => {
	const { problem_id, title, description, team_name } = req.body;

	if (!problem_id || !title || !description) {
		throw new ApiError(400, 'problem_id, title and description are required');
	}

	const solution = await solutionsService.createSolution(req.user.id, {
		problem_id,
		title,
		description,
		team_name: team_name ?? null,
		status: 'submitted',
		progress: 0,
	});

	return apiResponse(res, 201, solution, 'Solution submitted successfully');
});

export const listSolutions = asyncHandler(async (req, res) => {
	const { problem_id, university_id, status } = req.query;
	const solutions = await solutionsService.listSolutions({ problem_id, university_id, status });
	return apiResponse(res, 200, solutions);
});

export const getSolution = asyncHandler(async (req, res) => {
	const solution = await solutionsService.getSolutionById(req.params.id);
	return apiResponse(res, 200, solution);
});

export const updateProgress = asyncHandler(async (req, res) => {
	const { progress, status } = req.body;

	if (progress === undefined && !status) {
		throw new ApiError(400, 'progress or status is required');
	}

	if (progress !== undefined && (!Number.isInteger(progress) || progress < 0 || progress > 100)) {
		throw new ApiError(400, 'progress must be an integer between 0 and 100');
	}

	const solution = await solutionsService.updateSolutionProgress(req.params.id, {
		...(progress === undefined ? {} : { progress }),
		...(status ? { status } : {}),
		updated_at: new Date().toISOString(),
	});

	return apiResponse(res, 200, solution, 'Solution updated successfully');
});
