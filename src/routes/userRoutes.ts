import { Router } from 'express';

import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';

import {
  createUser,
  listUsers,
  updateUser,
  deleteUser,
  restoreUser,
} from '../controllers/userController';

const router = Router();

router.post('/', createUser);
router.get('/', authMiddleware, roleMiddleware('list_users'), listUsers);
router.patch('/:id', authMiddleware, roleMiddleware('update_user'), updateUser);
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware('delete_user'),
  deleteUser
);
router.post(
  '/restore/:id',
  authMiddleware,
  roleMiddleware('restore_user'),
  restoreUser
);

export default router;
