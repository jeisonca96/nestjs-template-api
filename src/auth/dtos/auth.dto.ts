import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export enum Role {
  User = 'user',
  Admin = 'admin',
}

@ApiTags('DTO')
export class RegisterRequestDto {
  @ApiProperty({ example: 'user1' })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'password' })
  @IsNotEmpty()
  password: string;
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

@ApiTags('DTO')
export class GenerateApiKeyRequestDto {
  @ApiProperty({ example: 'API key name here' })
  @IsNotEmpty()
  name: string;
}
@ApiTags('DTO')
export class GenerateApiKeyResponseDto {
  @ApiProperty()
  apiKey: string;

  @ApiProperty()
  secret: string;
}

@ApiTags('DTO')
export class ValidateApiKeyResponseDto {
  @ApiProperty({ example: 'API key and secret are valid' })
  message: string;
}
