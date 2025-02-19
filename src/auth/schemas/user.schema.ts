import { Schema, Document } from 'mongoose';
import { Role } from '../constants';

export interface User extends Document {
  username: string;
  password: string;
  roles: Role[];
  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = new Schema<User>(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roles: {
      type: [String],
      enum: Role,
      default: [Role.User],
    },
  },
  { timestamps: true },
);
