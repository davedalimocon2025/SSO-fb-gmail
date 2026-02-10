import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const uri: string = process.env.MONGODB_URI || 'mongodb+srv://romeodave2025_db_user:1234@cluster0.9bg3el9.mongodb.net/?appName=Cluster0';

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family:4,
      bufferCommands: false,
    });
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
