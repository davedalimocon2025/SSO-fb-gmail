import express, { Request, Response } from 'express';
import session from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import passport from 'passport';
import './passport'; // Your Passport Strategy configuration
import authRoutes from './routes/authRoutes';
import Message from './models/message';
import { createServer } from 'http';
import { Server } from 'socket.io';

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

// Create the HTTP fav to wrap the Express app
const httpServer = createServer(app);

// Initialize Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", // Your Vite/React URL
    methods: ["GET", "POST"]
  }
});

const startServer = async () => {
  try {
    // 1. Wait for DB to be 100% ready
    await connectDB(); 

    // 2. Only THEN start the server
    const PORT = 3001;
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server due to DB error", error);
  }
};

// Start it up!
startServer();
io.on('connection', async (socket) => {

  console.log('A user connected:', socket.id);

  // 2. Fetch and Send History to the newly connected user
  try {
    const history = await Message.find().sort({ timestamp: 1 }).limit(50);
    socket.emit('load_history', history);
  } catch (err) {
    console.error("Error fetching history:", err);
  }

  // 3. Listen for a new message
  socket.on('send_message', async (data) => {
    try {
      // Create and save to MongoDB
      const newMessage = new Message({
        author: data.author,
        message: data.message,
        time: data.time
      });
      
      const savedMessage = await newMessage.save();

      // Broadcast the saved message (including the DB _id) to EVERYONE
      io.emit('receive_message', savedMessage);
    } catch (err) {
      console.error("Error saving message:", err);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});




