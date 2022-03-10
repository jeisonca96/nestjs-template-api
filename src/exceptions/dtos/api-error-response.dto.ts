import { ApiProperty, ApiTags } from '@nestjs/swagger';

@ApiTags('DTO')
export class ApiErrorResponseDto {
  @ApiProperty()
  readonly statusCode: number;

  @ApiProperty()
  readonly message: string;

  @ApiProperty()
  readonly error: object;
}
