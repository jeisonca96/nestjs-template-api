import { HttpStatus } from '@nestjs/common';
import { BaseException } from '../../core-services/exceptions/base.exception';

export class MessageTooLongException extends BaseException {
  constructor(details?: string | object) {
    super(
      'Message length exceeds 100 characters, please shorten your message.',
      'MESSAGE_TOO_LONG',
      HttpStatus.BAD_REQUEST,
      details,
    );
  }
}
