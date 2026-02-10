import { Request, Response } from 'express';
import * as authService from '../services/authService';
import bcrypt from 'bcrypt';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await authService.findUserByEmail(email);

    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password as string);

    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    // Success! (Usually you'd generate a JWT here)
    res.status(200).json({ 
      message: "Login successful", 
      user: { id: user._id, email: user.email, name: user.displayName } 
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, displayName, role } = req.body;

    // 1. Check if user already exists
    const existingUser = await authService.findUserByEmail(email);
    if (existingUser) {
      res.status(400).json({ message: "Email already registered" });
      return;
    }

    // 2. Create the user
    const user = await authService.registerUser({ email, password, displayName, role });

    res.status(201).json({
      message: "User created successfully",
      user: { id: user._id, email: user.email, name: user.displayName, role: user.role }
    });
  } catch (error: any) {
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};