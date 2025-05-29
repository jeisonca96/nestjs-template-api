import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ApiErrorResponseDto } from 'src/core-services/exceptions/dtos/api-error-response.dto';
import { GetSignedUrlDto } from '../cloud-storage.dto';

export const FileUploadApiDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Upload file to cloud storage',
      description: 'Uploads a file to S3 bucket in specified path',
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary',
            description: 'File to upload (max size: 10MB)',
          },
        },
      },
    }),
    ApiQuery({
      name: 'path',
      description: 'Target path in bucket (e.g. "user-uploads/document")',
      example: 'user-uploads/document',
      required: true,
    }),
    ApiCreatedResponse({
      description: 'File uploaded successfully',
      schema: {
        type: 'object',
        properties: {
          key: {
            type: 'string',
            example: 'user-uploads/document-1742796574018-file.pdf',
          },
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Bad Request',
      type: ApiErrorResponseDto,
      examples: {
        example1: {
          summary: 'File is required',
          value: {
            statusCode: 400,
            message: 'File is required',
            error: 'FILE_REQUIRED',
          },
        },
        example2: {
          summary: 'Path is required',
          value: {
            statusCode: 400,
            message: 'Path is required',
            error: 'PATH_REQUIRED',
          },
        },
        example3: {
          summary: 'File size exceeds limit',
          value: {
            message:
              'Validation failed (current file size is 141348565, expected size is less than 10485760)',
            error: 'Bad Request',
            statusCode: 400,
          },
        },
      },
    }),
  );

export const DeleteFileApiDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Delete file from storage',
      description: 'Permanently deletes a file from S3 bucket',
    }),
    ApiParam({
      name: 'key',
      description: 'Full file key/path in bucket',
      example: 'user-uploads/report.pdf',
    }),
    ApiNoContentResponse({
      description: 'File successfully deleted',
    }),
  );

export const GetSignedUrlApiDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Generate signed URL',
      description: 'Creates a temporary URL for secure file access',
    }),
    ApiBody({
      description: 'Request body is empty',
      type: GetSignedUrlDto,
    }),
    ApiOkResponse({
      description: 'Signed URL generated',
      schema: {
        type: 'object',
        properties: {
          url: {
            type: 'string',
            example: 'https://bucket.s3.amazonaws.com/key?X-Amz-Signature=...',
          },
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Invalid expiration time',
      type: ApiErrorResponseDto,
      example: {
        message: [
          'key should not be empty',
          'expires must be a number conforming to the specified constraints',
        ],
        error: 'Bad Request',
        statusCode: 400,
      },
    }),
  );
