import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';
import { TraceIdService } from '@/module/share/trace/trace.service';

interface RequestWithTraceId extends Request {
  traceId: string;
}

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  constructor(private readonly traceIdService: TraceIdService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<RequestWithTraceId>();
    const response = httpContext.getResponse<Response>();
    
    // Generate and assign trace ID
    const traceId = this.traceIdService.getTraceId();
    request.traceId = traceId;

    const startTime = Date.now();
    const { method, url, ip } = request;
    const userAgent = request.get('User-Agent') || 'Unknown';

    // Log incoming request
    this.logger.log(
      `[${traceId}] Incoming ${method} ${url} from ${ip} - ${userAgent}`,
    );

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime;
          const { statusCode } = response;
          
          this.logger.log(
            `[${traceId}] Completed ${method} ${url} - ${statusCode} in ${duration}ms`,
          );
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          const { statusCode } = response;
          
          this.logger.error(
            `[${traceId}] Failed ${method} ${url} - ${statusCode} in ${duration}ms`,
            error.stack,
          );
        },
      }),
    );
  }
}
