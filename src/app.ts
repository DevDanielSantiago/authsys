import express from 'express';

import errorHandler from './middlewares/errorHandler';

import userRoutes from './routes';

const app = express();
app.use(express.json());

//middlewares
app.use(errorHandler);

// routes
app.use(userRoutes)

export default app;
