import { Schema, Document } from 'mongoose';

export const Role = ['user', 'admin'] as const;

export interface User extends Document {
  username: string;
  password: string;
  role: 'user' | 'admin';
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
      default: 'user',
    },
  },
  { timestamps: true },
);
