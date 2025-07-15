import mongoose from 'mongoose';
import { myError } from '../utils/error.js';
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  const dbURI =
  process.env.NODE_ENV === 'development'
    ? 'mongodb://127.0.0.1:27017/OpenPin'
    : process.env.MONGO_URI;

  try {
    const connection = await mongoose.connect(dbURI);
    console.log('MongoDB connected:', connection.connection.host);
  } catch (error) {
    myError(error,'MongoDB connection error')
    process.exit(1);
  }
};

export default connectDB;