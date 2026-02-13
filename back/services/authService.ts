import User, { IUser } from '../models/User';
import bcrypt from 'bcrypt';

export const findUserByEmail = async (email: string) => {
  return await User.findOne({ email });
};

export const registerUser = async (userData: Partial<IUser>) => {
  // Hash the password before saving
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userData.password!, salt);

  const newUser = new User({
    ...userData,
    password: hashedPassword
  });

  return await newUser.save();
};

// services/authService.ts
export const getAuthenticatedUser = (user: Express.User | undefined) => {
  if (!user) return null;

  // You can clean up the Google profile here so you don't send 
  // sensitive tokens back to the frontend.
  return {
    id: (user as any).id,
    name: (user as any).displayName,
    email: (user as any).emails?.[0]?.value,
    photos: (user as any).photos?.[0]?.value
  };
};