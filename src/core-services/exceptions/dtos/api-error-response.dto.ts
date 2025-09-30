import { ApiProperty, ApiTags } from '@nestjs/swagger';

@ApiTags('DTO')
export class ApiErrorResponseDto {
  @ApiProperty({ type: 'number', description: 'HTTP status code of the error' })
  readonly statusCode: number;

  @ApiProperty({
    type: [String],
    description: 'A human-readable message describing the error',
  })
  readonly message: string | string[];

  @ApiProperty({
    type: 'string',
    description:
      'A specific, machine-readable error code (e.g., CATEGORY_NOT_FOUND)',
  })
  readonly code: string;

  @ApiProperty({
    type: 'string',
    required: false,
    description:
      'Additional, more granular details about the error, often for debugging or specific user guidance.',
  })
  readonly details?: string | object | string[];
}
