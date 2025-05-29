import { ApiProperty, ApiTags } from '@nestjs/swagger';

@ApiTags('DTO')
export class ApiErrorResponseDto {
  @ApiProperty({ type: 'number' })
  readonly statusCode: number;

  @ApiProperty({ type: [String] })
  readonly message: string | string[];

  @ApiProperty({ type: 'string' })
  readonly error: string;
}
