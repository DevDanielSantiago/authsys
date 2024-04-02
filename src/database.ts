import mongoose from 'mongoose';

const mongoURI = 'mongodb+srv://devdaniel:e8ikKUcfWfS8QvSv@cluster0.kwfcvyx.mongodb.net/';

const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
  }
};

export default connectToMongo;
