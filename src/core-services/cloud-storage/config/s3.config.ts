import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Config {
  constructor(private configService: ConfigService) {}

  get accessKeyId(): string {
    return this.configService.get<string>('AWS_ACCESS_KEY_ID');
  }

  get secretAccessKey(): string {
    return this.configService.get<string>('AWS_SECRET_ACCESS_KEY');
  }

  get region(): string {
    return this.configService.get<string>('AWS_REGION');
  }

  get bucketName(): string {
    return this.configService.get<string>('AWS_S3_BUCKET_NAME');
  }
}
