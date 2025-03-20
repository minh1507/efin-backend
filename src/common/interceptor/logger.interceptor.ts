import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { TraceIdService } from 'src/module/share/trace/trace.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly traceIdService: TraceIdService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const traceId = this.traceIdService.getTraceId();

    const request = context.switchToHttp().getRequest();
    request.traceId = traceId;

    return next.handle();
  }
}
