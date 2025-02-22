import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { Role } from '../constants';

@ApiTags('DTO')
export class RegisterRequestDto {
  @ApiProperty({ example: 'user1' })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'email@email.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+15555555555' })
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ example: 'password' })
  @IsNotEmpty()
  password: string;
}

@ApiTags('DTO')
export class UserResponseDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;

  @ApiProperty({ enum: Role })
  role: Role;

  @ApiProperty()
  isEmailVerified: boolean;

  @ApiProperty()
  isPhoneVerified: boolean;

  @ApiProperty()
  isVerified: boolean;

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

@ApiTags('DTO')
export class ChangePasswordRequestDto {
  @ApiProperty({ example: 'password' })
  @IsNotEmpty()
  newPassword: string;
}

@ApiTags('DTO')
export class ForgotPasswordRequestDto {
  @ApiProperty({ example: 'mail@mail.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
