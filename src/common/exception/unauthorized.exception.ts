import { HttpException, HttpStatus } from '@nestjs/common';
import { LoggerService } from '@/module/share/logger/logger.service';
import { ErrorResponse } from './bad-request.exception';

export class UnauthorizedException extends HttpException {
  constructor(
    message: string,
    logger: LoggerService,
  ) {
    logger.error(`UNAUTHORIZED: ${message}`, 'EXCEPTION');

    const errorResponse: ErrorResponse = {
      status: {
        code: HttpStatus.UNAUTHORIZED,
        success: false,
      },
      message: {
        failed: message,
      },
      ui: {
        flag: true,
      },
      trace: {
        id: logger.getTraceId(),
      },
    };

    super(errorResponse, HttpStatus.UNAUTHORIZED);
  }
} 