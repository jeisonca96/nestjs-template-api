import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Otp } from './otp.schema';
import * as crypto from 'crypto';
import { User } from 'src/auth/schemas/user.schema';

@Injectable()
export class OtpService {
  constructor(@InjectModel('Otp') private readonly otpModel: Model<Otp>) {}

  async generateOtp(
    user: User,
    expirationMinutes: number = 5,
  ): Promise<string> {
    await this.invalidateOtps(user.id);

    const code = crypto.randomInt(0, 999999).toString().padStart(6, '0');

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + expirationMinutes);

    await this.otpModel.create({
      user: user._id,
      code,
      expiresAt,
    });

    return code;
  }

  async validateOtp(userId: string, code: string): Promise<boolean> {
    const otp = await this.otpModel.findOne({
      user: userId,
      code,
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (!otp) return false;

    await this.otpModel.findByIdAndUpdate(otp._id, { used: true });
    return true;
  }

  async invalidateOtps(userId: string): Promise<void> {
    await this.otpModel.updateMany(
      {
        user: userId,
        used: false,
      },
      { $set: { used: true } },
    );
  }

  async getValidOtp(userId: string): Promise<Otp | null> {
    return this.otpModel.findOne({
      user: userId,
      used: false,
      expiresAt: { $gt: new Date() },
    });
  }
}
