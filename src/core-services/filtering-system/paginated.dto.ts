import { applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiProperty,
  ApiQuery,
  getSchemaPath,
} from '@nestjs/swagger';

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
