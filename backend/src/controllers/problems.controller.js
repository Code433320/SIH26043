import * as problemsService from '../services/problems.service.js';
import { apiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';

// POST /problems  (citizen)
export const createProblem = asyncHandler(async (req, res) => {
  const { title, description, location, category } = req.body;

  if (!title || !description) {
    throw new ApiError(400, 'title and description are required');
  }

  const problem = await problemsService.createProblem(req.user.id, {
    title,
    description,
    location,
    category,
  });

  // TODO once Person C's ML module is ready, call it here:
  // const analysis = await analyzeProblem(problem.description);
  // await problemsService.updateProblemStatus(problem.id, {
  //   category: analysis.category,
  //   priority_score: analysis.priority_score,
  //   university_id: analysis.matched_university_id,
  //   status: 'matched',
  // });

  return apiResponse(res, 201, problem, 'Problem submitted successfully');
});

// GET /problems/:id
export const getProblem = asyncHandler(async (req, res) => {
  const problem = await problemsService.getProblemById(req.params.id);
  return apiResponse(res, 200, problem);
});

// GET /problems?status=&university_id=&citizen_id=&category=
export const listProblems = asyncHandler(async (req, res) => {
  const { status, university_id, citizen_id, category } = req.query;
  const problems = await problemsService.listProblems({
    status,
    university_id,
    citizen_id,
    category,
  });
  return apiResponse(res, 200, problems);
});

// POST /problems/:id/verify  (government only)
export const verifyProblem = asyncHandler(async (req, res) => {
  const problem = await problemsService.verifyProblem(req.params.id);
  return apiResponse(res, 200, problem, 'Problem verified');
});
