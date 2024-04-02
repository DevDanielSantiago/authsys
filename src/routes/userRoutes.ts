import { Router } from 'express';

import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';

import { createUser, listUsers, updateUser, deleteUser, restoreUser } from '../controllers/userController'

const router = Router();

router.post('/', createUser);
router.get('/', authMiddleware, roleMiddleware(['admin', 'superAdmin']), listUsers);
router.patch('/:id', authMiddleware, roleMiddleware(['user', 'admin', 'superAdmin']), updateUser);
router.delete('/:id', authMiddleware, roleMiddleware(['user', 'admin', 'superAdmin']), deleteUser);
router.post('/restore/:id', authMiddleware, roleMiddleware(['user', 'admin', 'superAdmin']), restoreUser);

export default router;
