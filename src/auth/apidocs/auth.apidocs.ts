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
  ApiBadRequestResponse,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import { ApiErrorResponseDto } from '../../exceptions/dtos/api-error-response.dto';
import {
  ChangePasswordRequestDto,
  ForgotPasswordRequestDto,
  GenerateApiKeyRequestDto,
  GenerateApiKeyResponseDto,
  LoginResponseDto,
  RegisterRequestDto,
  UserResponseDto,
  ValidateApiKeyResponseDto,
} from '../dtos/auth.dto';
import {
  GlobalQueryParamsDocs,
  PaginatedResponse,
} from 'src/core-services/filtering-system/paginated.dto';

export const RegisterApiDocs = () =>
  applyDecorators(
    ApiConsumes('application/json'),
    ApiOperation({
      description: 'Register new user',
      summary: 'Register new user',
    }),
    ApiBody({
      type: RegisterRequestDto,
    }),
    ApiCreatedResponse({
      description: 'User has been successfully registered',
      type: UserResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'Bad request',
      type: ApiErrorResponseDto,
      example: {
        message: ['password should not be empty'],
        error: 'Bad Request',
        statusCode: 400,
      },
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
    ApiBody({
      type: GenerateApiKeyRequestDto,
    }),
    ApiOkResponse({
      description: 'API key generated successfully',
      type: GenerateApiKeyResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'Bad request',
      type: ApiErrorResponseDto,
      example: {
        message: ['name should not be empty'],
        error: 'Bad Request',
        statusCode: 400,
      },
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

export const ChangePasswordApiDocs = () =>
  applyDecorators(
    ApiSecurity('jwt'),
    ApiOperation({
      description: 'Change password',
      summary: 'Change password',
    }),
    ApiBody({
      type: ChangePasswordRequestDto,
    }),
    ApiNoContentResponse({
      description: 'Password has been changed',
    }),
    ApiUnauthorizedResponse({
      description: 'Invalid credentials',
      type: ApiErrorResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'Bad request',
      type: ApiErrorResponseDto,
    }),
  );

export const ForgotPasswordApiDocs = () =>
  applyDecorators(
    ApiOperation({
      description: 'Forgot password',
      summary: 'Forgot password',
    }),
    ApiBody({
      type: ForgotPasswordRequestDto,
    }),
    ApiNoContentResponse({
      description: 'Password reset email has been sent',
    }),
    ApiUnauthorizedResponse({
      description: 'Invalid credentials',
      type: ApiErrorResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'Bad request',
      type: ApiErrorResponseDto,
    }),
  );

export const GetAllUsersApiDocs = () => {
  return applyDecorators(
    ApiOperation({
      description: 'Get all users',
      summary: 'Get all users',
    }),
    GlobalQueryParamsDocs(),
    ApiOkResponse({
      description: 'List of all users',
      type: PaginatedResponse(UserResponseDto),
    }),
    ApiBadRequestResponse({
      description: 'Bad request',
      type: ApiErrorResponseDto,
    }),
  );
};
