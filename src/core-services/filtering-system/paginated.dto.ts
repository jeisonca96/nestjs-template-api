import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiExtraModels,
  ApiProperty,
  ApiQuery,
  getSchemaPath,
} from '@nestjs/swagger';
import { ApiErrorResponseDto } from 'src/core-services/exceptions/dtos/api-error-response.dto';

export class PaginationDto {
  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  perPage: number;

  @ApiProperty({ example: 10 })
  totalPages: number;

  @ApiProperty({ example: 2, nullable: true })
  nextPage: number | null;

  @ApiProperty({ example: null, nullable: true })
  prevPage: number | null;
}

@ApiExtraModels(PaginationDto)
export class PaginatedResponseDto<T> {
  @ApiProperty({ description: 'Response data' })
  data: T[];

  pagination: PaginationDto;
}

export function PaginatedResponseSchema(ResponseDto: Function) {
  return {
    type: 'object',
    properties: {
      data: {
        type: 'array',
        items: { $ref: getSchemaPath(ResponseDto) },
      },
      pagination: {
        $ref: getSchemaPath(PaginationDto),
      },
    },
  };
}

export const GlobalQueryParamsDocs = () => {
  return applyDecorators(
    ApiExtraModels(PaginatedResponseDto),
    ApiQuery({
      name: 'page',
      required: false,
      description: 'Page number',
      example: 1,
      type: Number,
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      description: 'Results per page',
      example: 10,
      type: Number,
    }),
    ApiQuery({
      name: 'sortBy',
      required: false,
      description: 'Field to sort by',
      example: 'createdAt',
      type: String,
    }),
    ApiQuery({
      name: 'sortOrder',
      required: false,
      description: 'Sort direction',
      enum: ['asc', 'desc'],
      example: 'desc',
    }),
    ApiQuery({
      name: 'filters',
      required: false,
      description: 'Filter criteria in JSON format (see documentation)',
      example: {
        or: [
          { email: { eq: 'example@domain.com' } },
          { status: { in: ['active', 'pending'] } },
        ],
      },
      type: String,
    }),
  );
};

export const GlobalExceptionDocs = () => {
  return applyDecorators(
    ApiBadRequestResponse({
      description: 'Bad Request',
      type: ApiErrorResponseDto,
      examples: {
        example1: {
          summary: 'Invalid values',
          value: {
            message: [
              'page must be a number conforming to the specified constraints',
              'limit must be a number conforming to the specified constraints',
            ],
            error: 'Bad Request',
            statusCode: 400,
          },
        },
        example2: {
          summary: 'Invalid criteria format',
          value: {
            message: 'Invalid criteria format',
            error: 'INVALID_CRITERIA',
            statusCode: 400,
          },
        },
        example3: {
          summary: 'Invalid filters',
          value: {
            message: [
              'filters.0.operator must be one of the following values: eq, ne, gt, gte, lt, lte, in, nin, contains, between, exists, not_exists, regex, array_contains, array_size, elem_match',
            ],
            error: 'Bad Request',
            statusCode: 400,
          },
        },
      },
    }),
  );
};
