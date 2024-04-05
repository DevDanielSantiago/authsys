import { Router } from 'express';

import { authMiddleware } from '../middlewares/authMiddleware';

import { createPermission, listPermissions, updatePermission, deletePermission, restorePermission } from '../controllers/permissionController'

const router = Router();

router.post('/', createPermission);
router.get('/', authMiddleware, listPermissions);
router.patch('/:id', authMiddleware, updatePermission);
router.delete('/:id', authMiddleware, deletePermission);
router.post('/restore/:id', authMiddleware, restorePermission);

export default router;
