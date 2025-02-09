import { ApiProperty, ApiTags } from '@nestjs/swagger';

export enum Role {
  User = 'user',
  Admin = 'admin',
}

@ApiTags('DTO')
export class UserResponseDto {
  @ApiProperty()
  username: string;

  @ApiProperty({ enum: Role })
  role: Role;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  _id: string;
}

@ApiTags('DTO')
export class LoginResponseDto {
  @ApiProperty()
  jwt: string;

  @ApiProperty()
  expiration: number;

  @ApiProperty()
  refresh: string;

  @ApiProperty()
  refreshExpiration: number;
}

export class GenerateApiKeyResponseDto {
  @ApiProperty()
  apiKey: string;

  @ApiProperty()
  secret: string;
}

export class ValidateApiKeyResponseDto {
  @ApiProperty({ example: 'API key and secret are valid' })
  message: string;
}
