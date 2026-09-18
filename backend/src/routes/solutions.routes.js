import { Router } from 'express';
import * as solutionsController from '../controllers/solutions.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';

const router = Router();

router.post(
	'/',
	requireAuth,
	requireRole(['university', 'student']),
	solutionsController.createSolution
);
router.get('/', requireAuth, solutionsController.listSolutions);
router.get('/:id', requireAuth, solutionsController.getSolution);
router.patch(
	'/:id/progress',
	requireAuth,
	requireRole(['university', 'student']),
	solutionsController.updateProgress
);

export default router;
