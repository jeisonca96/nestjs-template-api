import { Schema, Document } from 'mongoose';
import { Role } from '../constants';

export interface User extends Document {
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
  roles: Role[];
  isVerified: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  tokenVersion: number;
  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = new Schema<User>(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, unique: true },
    phoneNumber: { type: String, unique: true },
    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    roles: {
      type: [String],
      enum: Role,
      default: [Role.User],
    },
    tokenVersion: { type: Number, default: 1 },
  },
  { timestamps: true },
);
