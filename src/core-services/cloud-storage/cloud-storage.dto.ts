import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

@ApiTags('CloudStorage')
export class GetSignedUrlDto {
  @ApiProperty({ example: 'user-id/dni/document-1742796574018-file.pdf' })
  @IsNotEmpty()
  @IsString()
  key: string;

  @ApiProperty({ required: false, example: 1800, default: 1800 })
  @IsOptional()
  @IsNumber()
  expires: number;
}
