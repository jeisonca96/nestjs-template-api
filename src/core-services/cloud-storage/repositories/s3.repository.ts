import { Injectable } from '@nestjs/common';
import { S3Config } from '../config/s3.config';
import {
  CustomLogger,
  CustomLoggerService,
} from 'src/core-services/logger/custom-logger.service';
import {
  S3Client,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Readable } from 'stream';
import { Upload } from '@aws-sdk/lib-storage';
import { AlertsService } from 'src/core-services/alerts/alerts.service';

@Injectable()
export class S3Repository {
  logger: CustomLogger;
  private s3: S3Client;
  private bucket: string;

  constructor(
    private readonly config: S3Config,
    private readonly customLoggerService: CustomLoggerService,
    private readonly alertsService: AlertsService,
  ) {
    this.logger = this.customLoggerService.createLogger(S3Repository.name);

    this.s3 = new S3Client({
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
    this.bucket = config.bucketName;
  }

  async uploadFile(
    fileBuffer: Buffer,
    key: string,
    mimeType: string,
    metadata?: Record<string, string>,
  ): Promise<string> {
    const executeUpload = async (attempt: number): Promise<void> => {
      try {
        const upload = new Upload({
          client: this.s3,
          params: {
            Bucket: this.bucket,
            Key: key,
            Body: fileBuffer,
            ContentType: mimeType,
            Metadata: metadata,
          },
          partSize: 10 * 1024 * 1024,
          queueSize: 4,
        });

        await upload.done();
        this.logger.log(`[S3 Upload] Successfully uploaded file: ${key}`);
      } catch (error) {
        if (attempt === 0) {
          this.logger.warn(
            `[S3 Upload] First attempt failed, retrying immediately: ${key}`,
            error,
          );
          return executeUpload(1);
        }
        throw error;
      }
    };

    try {
      executeUpload(0).catch((error) => {
        this.logger.error(
          `[S3 Upload] Final upload failed: ${key}`,
          error.stack,
        );
        this.alertsService.alert({
          title: 'S3 Upload Failed',
          description: `Failed to upload file to S3 bucket`,
          severity: 'error',
          additionalInfo: `File key: ${key}, Attempt: 1`,
          metadata: { error: error.message, stack: error.stack, key },
        });
      });

      return key;
    } catch (error) {
      this.logger.error(
        `[S3 Upload] Initialization failed: ${key}`,
        error.stack,
      );
      throw new Error(`Failed to process upload request for ${key}`);
    }
  }

  async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      await this.s3.send(command);
    } catch (error) {
      this.logger.error('Error deleting file from S3', error.stack);
      throw error;
    }
  }

  async getSignedUrl(key: string, expires: number = 3600): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      return await getSignedUrl(this.s3, command, { expiresIn: expires });
    } catch (error) {
      this.logger.error('Error generating signed URL', error.stack);
      throw error;
    }
  }

  async getFile(key: string): Promise<Readable> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      const response = await this.s3.send(command);
      return response.Body as Readable;
    } catch (error) {
      this.logger.error('Error retrieving file from S3', error.stack);
      throw error;
    }
  }
}
