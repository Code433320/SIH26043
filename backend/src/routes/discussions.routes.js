import { Router } from 'express';
import * as discussionsController from '../controllers/discussions.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/problem/:problemId', requireAuth, discussionsController.listMessages);
router.post('/', requireAuth, discussionsController.createMessage);

export default router;
