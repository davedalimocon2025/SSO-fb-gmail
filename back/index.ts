import express, { Request, Response } from 'express';
import session from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import passport from 'passport';
import './passport'; // Your Passport Strategy configuration
import authRoutes from './routes/authRoutes';

dotenv.config();

const app = express();

// 1. Global Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Your React URL
  credentials: true,               // Required to send cookies back and forth
}));
app.use(express.json());

// 2. Session & Passport Middleware (Order matters!)
app.use(session({ 
  secret: process.env.SESSION_SECRET || 'your_secret', 
  resave: false, 
  saveUninitialized: false 
}));

app.use(passport.initialize());
app.use(passport.session());

// 3. Routes
app.use('/api/auth',authRoutes);
app.get('/api/hello', (req: Request, res: Response) => {
  res.json({ message: "Hello from the backend!" });
});
// Google Auth Trigger
app.get('/auth/google', 
  passport.authenticate('google', 
    { scope: ['profile', 'email']
     }
     // Force account selection on each login
  )
);

// Google Auth Callback
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req: Request, res: Response) => {
    // Redirect to your frontend dashboard
    res.redirect('http://localhost:5173/'); 
  }

);

// 4. Start Server Logic
async function startApp() {
  try {
    // Wait for DB connection
    await connectDB(); 
    
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`🚀 Database connected and server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start the app:", err);
    process.exit(1);
  }
}

startApp();