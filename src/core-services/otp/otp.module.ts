import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Otp, OtpSchema } from './otp.schema';
import { OtpService } from './otp.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Otp', schema: OtpSchema }])],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
