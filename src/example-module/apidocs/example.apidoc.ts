import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import {
  CreateExampleDto,
  ExampleDto,
  ExampleResponseDto,
} from '../dtos/example.dto';
import { ApiErrorResponseDto } from 'src/core-services/exceptions/dtos/api-error-response.dto';

export const GetExampleApiDocs = () =>
  applyDecorators(
    ApiOperation({
      description: 'Get example hello message',
      summary: 'Get hello message',
    }),
    ApiOkResponse({
      description: 'Hello message returned successfully',
      type: ExampleResponseDto,
    }),
  );

export const CreateExampleApiDocs = () =>
  applyDecorators(
    ApiConsumes('application/json'),
    ApiOperation({
      description: 'Create a new example with date and optional message',
      summary: 'Create new example',
    }),
    ApiBody({
      type: CreateExampleDto,
    }),
    ApiCreatedResponse({
      description: 'Example has been successfully created',
      type: ExampleDto,
    }),
    ApiBadRequestResponse({
      description: 'Bad request',
      type: ApiErrorResponseDto,
      examples: {
        example1: {
          summary: 'Validation errors',
          value: {
            message: [
              'date should not be empty',
              'date must be a valid ISO 8601 date string',
              'Date must be in the future',
            ],
            error: 'Bad Request',
            statusCode: 400,
          },
        },
        example2: {
          summary: 'Message too long',
          value: {
            message:
              'Message length exceeds 100 characters, please shorten your message.',
            error: 'MESSAGE_TOO_LONG',
            statusCode: 400,
          },
        },
      },
    }),
  );
