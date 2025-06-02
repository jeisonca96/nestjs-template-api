import { Transform } from 'class-transformer';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import * as validator from 'validator';

/**
 * Custom validation decorators for enhanced security and data validation
 */

// Transform decorator to sanitize strings
export const SanitizeHtml = () =>
  Transform(({ value }) => {
    if (typeof value === 'string') {
      return validator.escape(value);
    }
    return value;
  });

// Transform decorator to trim strings
export const Trim = () =>
  Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.trim();
    }
    return value;
  });

// Transform decorator to normalize email
export const NormalizeEmail = () =>
  Transform(({ value }) => {
    if (typeof value === 'string') {
      return validator.normalizeEmail(value) || value;
    }
    return value;
  });

// Custom validator for strong passwords
@ValidatorConstraint({ async: false })
export class IsStrongPasswordConstraint
  implements ValidatorConstraintInterface
{
  validate(password: string): boolean {
    if (!password) return false;

    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
      password,
    );

    return (
      hasMinLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumbers &&
      hasSpecialChar
    );
  }

  defaultMessage(): string {
    return 'Password must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters';
  }
}

export function IsStrongPassword(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsStrongPasswordConstraint,
    });
  };
}

// Custom validator for MongoDB ObjectId
@ValidatorConstraint({ async: false })
export class IsValidObjectIdConstraint implements ValidatorConstraintInterface {
  validate(id: string): boolean {
    if (!id) return false;
    return validator.isMongoId(id);
  }

  defaultMessage(): string {
    return 'Invalid ObjectId format';
  }
}

export function IsValidObjectId(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidObjectIdConstraint,
    });
  };
}

// Custom validator for safe filenames
@ValidatorConstraint({ async: false })
export class IsSafeFilenameConstraint implements ValidatorConstraintInterface {
  validate(filename: string): boolean {
    if (!filename) return false;

    // Check for dangerous patterns
    const dangerousPatterns = [
      /\.\./, // Directory traversal
      /[<>:"|?*]/, // Windows reserved characters
      /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i, // Windows reserved names
    ];

    return !dangerousPatterns.some((pattern) => pattern.test(filename));
  }

  defaultMessage(): string {
    return 'Filename contains unsafe characters or patterns';
  }
}

export function IsSafeFilename(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsSafeFilenameConstraint,
    });
  };
}

// Custom validator for URL validation with specific protocols
@ValidatorConstraint({ async: false })
export class IsSecureUrlConstraint implements ValidatorConstraintInterface {
  validate(url: string, args: ValidationArguments): boolean {
    if (!url) return false;

    const allowedProtocols = args.constraints[0] || ['https'];

    try {
      const urlObj = new URL(url);
      return allowedProtocols.includes(urlObj.protocol.slice(0, -1));
    } catch {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments): string {
    const allowedProtocols = args.constraints[0] || ['https'];
    return `URL must use one of the following protocols: ${allowedProtocols.join(', ')}`;
  }
}

export function IsSecureUrl(
  allowedProtocols: string[] = ['https'],
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [allowedProtocols],
      validator: IsSecureUrlConstraint,
    });
  };
}

// Sanitization utilities
export class SanitizationUtils {
  static sanitizeInput(input: any): any {
    if (typeof input === 'string') {
      return validator.escape(input.trim());
    }

    if (Array.isArray(input)) {
      return input.map((item) => this.sanitizeInput(item));
    }

    if (typeof input === 'object' && input !== null) {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(input)) {
        sanitized[key] = this.sanitizeInput(value);
      }
      return sanitized;
    }

    return input;
  }

  static removeNullBytes(input: string): string {
    return input.replace(/\0/g, '');
  }

  static limitLength(input: string, maxLength: number): string {
    return input.length > maxLength ? input.substring(0, maxLength) : input;
  }
}
