import { Schema, Document } from 'mongoose';

export interface ApiKey extends Document {
  userId: string;
  apiKey: string;
  hashedSecret: string;
  createdAt: Date;
  updatedAt: Date;
}

export const ApiKeySchema = new Schema<ApiKey>(
  {
    userId: { type: String, required: true },
    apiKey: { type: String, required: true, unique: true },
    hashedSecret: { type: String, required: true },
  },
  { timestamps: true },
);
