
import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password?: string;
  displayName: string;
  role: 'passenger' | 'driver';
  createdAt: Date;
  googleId?: string; 
}

const UserSchema: Schema<IUser> = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  displayName: { type: String, required: true },
  role: { type: String, enum: ['passenger', 'driver'], default: 'passenger' },
  createdAt: { type: Date, default: Date.now },
  googleId: { type: String, unique: true, sparse: true } 
});

export default mongoose.model<IUser>('User', UserSchema);


