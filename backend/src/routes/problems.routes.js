import { Router } from 'express';
import * as problemsController from '../controllers/problems.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';

const router = Router();

// Citizen submits a problem
router.post('/', requireAuth, requireRole(['citizen']), problemsController.createProblem);

// Any logged-in role can view — used by citizen "My Reports", university "Find Problems",
// industry "Explore Solutions", government "Monitor Projects" (each just passes different query params)
router.get('/', requireAuth, problemsController.listProblems);

// Shared Problem Detail page — any logged-in role
router.get('/:id', requireAuth, problemsController.getProblem);

// Government approves a problem for the university matching pipeline.
router.post(
  '/:id/approve',
  requireAuth,
  requireRole(['government']),
  problemsController.approveProblem
);

// Backward-compatible alias for clients using the previous endpoint name.
router.post(
  '/:id/verify',
  requireAuth,
  requireRole(['government']),
  problemsController.approveProblem
);

export default router;
