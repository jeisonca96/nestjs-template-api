import { Schema, Document } from 'mongoose';
import { Role } from '../dtos/auth.dto';

export interface User extends Document {
  username: string;
  password: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = new Schema<User>(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: Role,
      default: Role.User,
    },
  },
  { timestamps: true },
);
