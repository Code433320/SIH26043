import * as problemsService from '../services/problems.service.js';
import { apiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';

// POST /problems  (citizen)
// backend/src/controllers/problems.controller.js — replace createProblem with this

import * as mlService from '../services/ml.service.js';

// POST /problems  (citizen)
export const createProblem = asyncHandler(async (req, res) => {
  const { title, description, location, category, affected_people, severity, urgency } = req.body;

  if (!title || !description) {
    throw new ApiError(400, 'title and description are required');
  }

  const problem = await problemsService.createProblem(req.user.id, {
    title,
    description,
    location,
    category,
  });

  // Call the ML service to categorize, score priority, and detect duplicates.
  // If the ML service is down, don't fail the whole submission — the problem
  // still exists with status "submitted", just unanalyzed for now.
  try {
    const analysis = await mlService.analyzeProblem({
      title,
      description,
      affected_people,
      severity,
      urgency,
    });

    const updated = await problemsService.updateProblemStatus(problem.id, {
      category: analysis.category,
      priority_score: analysis.priority_score,
      duplicate_flag: analysis.duplicate_flag,
      status: 'categorized',
    });

    return apiResponse(res, 201, updated, 'Problem submitted and analyzed successfully');
  } catch (mlError) {
    console.error('ML analysis failed:', mlError.message);
    return apiResponse(res, 201, problem, 'Problem submitted (ML analysis unavailable)');
  }
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

// POST /problems/:id/approve  (government only)
export const approveProblem = asyncHandler(async (req, res) => {
  const problem = await problemsService.approveProblem(req.params.id);
  return apiResponse(res, 200, problem, 'Problem approved successfully');
});

// Backward-compatible controller name for existing route consumers.
export const verifyProblem = approveProblem;
