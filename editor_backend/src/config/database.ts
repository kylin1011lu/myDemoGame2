import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/story_game';
    await mongoose.connect(mongoURI);
    isConnected = true;
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
} 