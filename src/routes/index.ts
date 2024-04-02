import { Router } from 'express';
import userRoutes from './userRoutes';

const router = Router();

router.get('/', (req, res) => {
  res.send('Hello World from index route!');
});

router.use('/users', userRoutes);

export default router;
