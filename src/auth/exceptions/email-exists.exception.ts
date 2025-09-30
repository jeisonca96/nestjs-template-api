import { HttpStatus } from '@nestjs/common';
import { BaseException } from '../../core-services/exceptions/base.exception';

export class EmailExistsException extends BaseException {
  constructor(details?: string | object) {
    super('Email already exists', 'EMAIL_EXISTS', HttpStatus.CONFLICT, details);
  }
}
