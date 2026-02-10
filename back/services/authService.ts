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