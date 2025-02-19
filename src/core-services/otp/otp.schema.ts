import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';

@Schema({ timestamps: true })
export class Otp extends Document {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  user: User;

  @Prop({ type: String, required: true })
  code: string;

  @Prop({ type: Date, required: true })
  expiresAt: Date;

  @Prop({ type: Boolean, default: false })
  used: boolean;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);

OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
