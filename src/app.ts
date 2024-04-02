import express from 'express';

import errorHandler from './middlewares/errorHandler';

import connectToMongo from './database';
import userRoutes from './routes';

const app = express();
const port = 3003;

app.use(express.json());

// DB connection
connectToMongo();

//middlewares
app.use(errorHandler);

// routes
app.use(userRoutes)

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
