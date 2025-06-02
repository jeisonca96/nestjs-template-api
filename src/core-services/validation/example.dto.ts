import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import {
  IsStrongPassword,
  IsValidObjectId,
  IsSafeFilename,
  IsSecureUrl,
  SanitizeHtml,
  Trim,
  NormalizeEmail,
} from '../validation/validation.utils';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @Trim()
  @SanitizeHtml()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @NormalizeEmail()
  @Transform(({ value }) => value?.toLowerCase())
  email: string;

  @IsStrongPassword()
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  @Trim()
  @SanitizeHtml()
  bio?: string;

  @IsOptional()
  @IsSecureUrl(['https'])
  website?: string;

  @IsOptional()
  @IsSafeFilename()
  @MaxLength(255)
  profileImage?: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @Trim()
  @SanitizeHtml()
  name?: string;

  @IsOptional()
  @IsEmail()
  @NormalizeEmail()
  @Transform(({ value }) => value?.toLowerCase())
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  @Trim()
  @SanitizeHtml()
  bio?: string;

  @IsOptional()
  @IsSecureUrl(['https'])
  website?: string;

  @IsOptional()
  @IsSafeFilename()
  @MaxLength(255)
  profileImage?: string;
}

export class UserIdDto {
  @IsValidObjectId()
  @IsNotEmpty()
  id: string;
}
