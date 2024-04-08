import { Router } from 'express';

import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';

import {
  createPermission,
  listPermissions,
  updatePermission,
  deletePermission,
  restorePermission,
} from '../controllers/permissionController';

const router = Router();

router.post(
  '/',
  authMiddleware,
  roleMiddleware('create_permission'),
  createPermission
);
router.get(
  '/',
  authMiddleware,
  roleMiddleware('list_permissions'),
  listPermissions
);
router.patch(
  '/:id',
  authMiddleware,
  roleMiddleware('update_permission'),
  updatePermission
);
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware('delete_permission'),
  deletePermission
);
router.post(
  '/restore/:id',
  authMiddleware,
  roleMiddleware('restore_permission'),
  restorePermission
);

export default router;
