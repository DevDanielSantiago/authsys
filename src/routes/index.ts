import { Router } from 'express';

import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import permissionRoutes from './permissionRoutes';

const router = Router();

router.get('/', (req, res) => {
  res.send('Hello World from index route!');
});

router.use('/', authRoutes);
router.use('/users', userRoutes);
router.use('/permissions', permissionRoutes);

export default router;
