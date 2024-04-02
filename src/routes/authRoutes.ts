import { Router } from 'express';

import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';

import { loginUser, updateRole } from '../controllers/authController'

const router = Router();

router.post('/login', loginUser);
router.patch('/role/:id', authMiddleware, roleMiddleware(['admin', 'superAdmin']), updateRole);

export default router;