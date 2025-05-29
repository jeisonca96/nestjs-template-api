import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { S3Repository } from './repositories/s3.repository';
import { CloudStorageService } from './cloud-storage.service';
import { S3Config } from './config/s3.config';
import { CloudStorageController } from './cloud-storage.controller';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [CloudStorageController],
  providers: [S3Config, S3Repository, CloudStorageService],
  exports: [CloudStorageService],
})
export class CloudStorageModule {}
