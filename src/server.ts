import app from './app';
import dotenv from 'dotenv';

import connectToMongo from './database';

dotenv.config();

const PORT = process.env.PORT;

const startServer = async () => {
  try {
    await connectToMongo();
    app.listen(PORT, () => {
      console.log(`Server running on port: ${PORT}`);
    });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

startServer();
