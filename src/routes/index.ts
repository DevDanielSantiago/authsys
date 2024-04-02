import { Router } from 'express';
import userRoutes from './userRoutes';
import authRoutes from './authRoutes';

const router = Router();

router.get('/', (req, res) => {
  res.send('Hello World from index route!');
});

router.use('/users', userRoutes);
router.use('/', authRoutes);

export default router;
