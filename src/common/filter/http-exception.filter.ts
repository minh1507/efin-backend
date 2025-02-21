import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    if (status === 500) {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: ['Server lỗi nghiêm trọng'],
        error: 'Code failed',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        toast: true,
      });
    } else {
      response.status(exception.getStatus()).json(exception.getResponse());
    }
  }
}
