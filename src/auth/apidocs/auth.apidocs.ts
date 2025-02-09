import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiCreatedResponse,
  ApiConsumes,
  ApiConflictResponse,
  ApiSecurity,
  ApiUnauthorizedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { ApiErrorResponseDto } from '../../exceptions/dtos/api-error-response.dto';
import {
  GenerateApiKeyResponseDto,
  LoginResponseDto,
  UserResponseDto,
  ValidateApiKeyResponseDto,
} from '../dtos/auth.dto';

export const RegisterApiDocs = () =>
  applyDecorators(
    ApiConsumes('application/json'),
    ApiOperation({
      description: 'Register new user',
      summary: 'Register new user',
    }),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          username: { type: 'string', example: 'user1' },
          password: { type: 'string', example: 'password' },
        },
      },
    }),
    ApiCreatedResponse({
      description: 'User has been successfully registered',
      type: UserResponseDto,
    }),
    ApiConflictResponse({
      description: 'Username already exists',
      type: ApiErrorResponseDto,
    }),
  );

export const LoginApiDocs = () =>
  applyDecorators(
    ApiSecurity('basic'),
    ApiOperation({
      description: 'Login using Basic Auth',
      summary: 'Login',
    }),
    ApiOkResponse({
      description: 'Successful login',
      type: LoginResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Invalid credentials',
      type: ApiErrorResponseDto,
    }),
  );

export const GenerateApiKeyApiDocs = () =>
  applyDecorators(
    ApiSecurity('jwt'),
    ApiOperation({
      description: 'Generate a new API key',
      summary: 'Generate API key',
    }),
    ApiOkResponse({
      description: 'API key generated successfully',
      type: GenerateApiKeyResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
      type: ApiErrorResponseDto,
    }),
  );

export const ValidateApiKeyApiDocs = () =>
  applyDecorators(
    ApiSecurity('apiKey'),
    ApiOperation({
      description: 'Validate API key',
      summary: 'Validate API key',
    }),
    ApiOkResponse({
      description: 'API key is valid',
      type: ValidateApiKeyResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Invalid API key or secret',
      type: ApiErrorResponseDto,
    }),
  );
