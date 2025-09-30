import { HttpException, HttpStatus } from '@nestjs/common';

export class BaseException extends HttpException {
  constructor(
    message: string,
    code: string,
    statusCode: HttpStatus,
    details?: string | object,
  ) {
    super({ message, code, details, statusCode }, statusCode);
  }
}
