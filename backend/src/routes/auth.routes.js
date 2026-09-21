import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/me', requireAuth, authController.getMe);
router.patch('/me', requireAuth, authController.updateMe);

export default router;