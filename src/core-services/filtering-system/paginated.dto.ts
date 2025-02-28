import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiProperty, ApiQuery } from '@nestjs/swagger';

export class PaginatedResponseDto<T> {
  @ApiProperty({ description: 'Response data' })
  data: T[];

  @ApiProperty({
    description: 'Pagination metadata',
    example: {
      total: 100,
      page: 1,
      perPage: 10,
      totalPages: 10,
      nextPage: 2,
      prevPage: null,
    },
  })
  pagination: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
    nextPage: number | null;
    prevPage: number | null;
  };
}

export const PaginatedResponse = <T extends Function>(model: T) => {
  class PaginatedResponseClass extends PaginatedResponseDto<T> {
    @ApiProperty({ type: [model] })
    data: T[];
  }
  return PaginatedResponseClass;
};

export const GlobalQueryParamsDocs = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Get paginated results',
      description: 'Endpoint to get paginated results with advanced filtering',
    }),
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
