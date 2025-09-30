import { HttpStatus } from '@nestjs/common';
import { BaseException } from '../../core-services/exceptions/base.exception';

export class PhoneExistsException extends BaseException {
  constructor(details?: string | object) {
    super('Phone already exists', 'PHONE_EXISTS', HttpStatus.CONFLICT, details);
  }
}
