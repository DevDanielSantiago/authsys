import { Router } from 'express';

import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';

import {
  createRole,
  listRoles,
  updateRole,
  deleteRole,
  restoreRole,
} from '../controllers/roleController';

const router = Router();

router.post('/', authMiddleware, roleMiddleware('create_role'), createRole);
router.get('/', authMiddleware, roleMiddleware('list_roles'), listRoles);
router.patch('/:id', authMiddleware, roleMiddleware('update_role'), updateRole);
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware('delete_role'),
  deleteRole
);
router.post(
  '/restore/:id',
  authMiddleware,
  roleMiddleware('restore_role'),
  restoreRole
);

export default router;
