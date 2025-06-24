import { HttpException, HttpStatus } from '@nestjs/common';
import { LoggerService } from '@/module/share/logger/logger.service';
import { ErrorResponse } from './bad-request.exception';

export class NotFoundException extends HttpException {
  constructor(
    message: string,
    logger: LoggerService,
  ) {
    logger.error(`NOT_FOUND: ${message}`, 'EXCEPTION');

    const errorResponse: ErrorResponse = {
      status: {
        code: HttpStatus.NOT_FOUND,
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

    super(errorResponse, HttpStatus.NOT_FOUND);
  }
} 