import express from 'express';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import cors from 'cors';
import dotenv from 'dotenv';

const app = express();
app.use(cors());
dotenv.config();
app.use(express.json());
app.use('/api/auth', authRoutes);


// Create an async function so we can use 'await'
async function startApp() {
  try {
    // 1. We WAIT here until the DB is actually connected
    await connectDB(); 
    
    // 2. ONLY then do we start the server
    app.listen(3001, () => {
      console.log("🚀 Database connected and server running on port 3001");
    });
  } catch (err) {
    console.error("❌ Failed to start the app:", err);
  }
}

startApp();