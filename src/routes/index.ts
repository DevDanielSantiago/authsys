import { Router } from 'express';

import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import permissionRoutes from './permissionRoutes';
import roleRoutes from './roleRoutes';

const router = Router();

router.get('/', (req, res) => {
  res.send('Hello World from index route!');
});

router.use('/', authRoutes);
router.use('/users', userRoutes);
router.use('/permissions', permissionRoutes);
router.use('/roles', roleRoutes);

export default router;
