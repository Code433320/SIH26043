import { Router } from 'express';
import * as engagementsController from '../controllers/engagements.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';

const router = Router();
const industryRoles = ['industry', 'ngo'];

router.post(
	'/',
	requireAuth,
	requireRole(industryRoles),
	engagementsController.createEngagement
);
router.get('/', requireAuth, requireRole(industryRoles), engagementsController.listEngagements);
router.get('/:id', requireAuth, engagementsController.getEngagement);
router.patch(
	'/:id/status',
	requireAuth,
	requireRole(industryRoles),
	engagementsController.updateStatus
);

export default router;
