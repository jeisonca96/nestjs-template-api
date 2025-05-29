import { BadRequestException, Injectable } from '@nestjs/common';
import { S3Repository } from './repositories/s3.repository';
import {
  CustomLogger,
  CustomLoggerService,
} from 'src/core-services/logger/custom-logger.service';

@Injectable()
export class CloudStorageService {
  private logger: CustomLogger;

  constructor(
    private readonly s3Repository: S3Repository,
    private readonly loggerService: CustomLoggerService,
  ) {
    this.logger = this.loggerService.createLogger(CloudStorageService.name);
  }

  async uploadFile(
    file: Express.Multer.File,
    path: string,
    metadata?: Record<string, string>,
  ): Promise<{ key: string }> {
    this.logger.log(`Uploading file to path: ${path}`);
    this.logger.log(`File name: ${file.originalname}`);
    this.logger.log(`File size: ${file.size} bytes`);
    this.logger.log(`File type: ${file.mimetype}`);
    this.logger.log(`File buffer length: ${file.buffer.length} bytes`);

    if (!path) {
      throw new BadRequestException('Path is required', 'PATH_REQUIRED');
    }

    const result = await this.s3Repository.uploadFile(
      file.buffer,
      path + '-' + Date.now() + '-' + file.originalname.replace(/\s+/g, ''),
      file.mimetype,
      metadata,
    );

    return { key: result };
  }

  async deleteFile(key: string): Promise<void> {
    this.logger.log(`Deleting file with key: ${key}`);
    await this.s3Repository.deleteFile(key);
  }

  async getSignedUrl(key: string, expires?: number): Promise<{ url: string }> {
    this.logger.log(`Generating signed URL for key: ${key}`);
    const url = await this.s3Repository.getSignedUrl(key, expires);

    return { url };
  }

  async getFile(key: string): Promise<Buffer> {
    this.logger.log(`Retrieving file with key: ${key}`);
    const response = await this.s3Repository.getFile(key);
    const chunks: Buffer[] = [];
    for await (const chunk of response) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    return Buffer.concat(chunks);
  }
}
