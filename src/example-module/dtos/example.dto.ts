import { ApiProperty, ApiTags } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { IsFutureDate } from '../decorators/validators.decorator';

@ApiTags('Appointments')
export class CreateExampleDto {
  @ApiProperty({ example: '2025-03-04T10:00:00Z' })
  @IsNotEmpty()
  @IsDateString()
  @IsFutureDate()
  date: Date;

  @ApiProperty({
    required: false,
    example: 'Hello world',
  })
  @IsOptional()
  @IsString()
  message?: string;
}

export class ExampleResponseDto {
  @ApiProperty({ example: 'Hello World!' })
  message: string;
}

export class ExampleDto extends CreateExampleDto {
  @ApiProperty({ example: '671f2c5e3b4d9a001c123456' })
  _id?: string;

  @ApiProperty({ example: '2025-01-20T10:30:00.000Z' })
  createdAt?: Date;

  @ApiProperty({ example: '2025-01-20T10:30:00.000Z' })
  updatedAt?: Date;
}
