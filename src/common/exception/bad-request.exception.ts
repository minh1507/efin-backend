import { HttpException, HttpStatus } from '@nestjs/common';
import { LoggerService } from '@/module/share/logger/logger.service';

export interface ErrorResponse {
  status: {
    code: HttpStatus;
    success: boolean;
  };
  message: {
    failed: string;
  };
  ui: {
    flag: boolean;
  };
  trace: {
    id: string;
  };
}

export class BadRequestException extends HttpException {
  constructor(
    message: string,
    logger: LoggerService,
  ) {
    logger.badRequest(`${message}`, 'EXCEPTION');

    const errorResponse: ErrorResponse = {
      status: {
        code: HttpStatus.BAD_REQUEST,
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

    super(errorResponse, HttpStatus.BAD_REQUEST);
  }
} 