import { HttpException, HttpStatus } from '@nestjs/common';
import { LoggerService } from 'src/module/share/logger/logger.service';

export class BadRequestException extends HttpException {
  constructor(
    message: string,
    private readonly logger: LoggerService,
  ) {
    logger.badRequest(`${message}`, 'EXCEPTION');

    super(
      {
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
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
