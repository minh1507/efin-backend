import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { TraceIdService } from 'src/module/share/trace/trace.service';
import SysHelper from 'src/util/sys.util';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly traceIdService: TraceIdService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const traceId = this.traceIdService.getTraceId();

    const request = context.switchToHttp().getRequest();
    request.traceId = traceId;

    const lang = request.headers['lang'] || 'vi';

    return next.handle().pipe(
      tap((data) => {
        if (data && typeof data === 'object') {
          data.message = this.getMessage(data.message, lang);
        }
      }),
    );
  }

  getMessage = (messageObj: Record<string, string>, lang: string) => {
    const enumObj: Record<string, string> = {};

    Object.keys(messageObj).forEach((key) => {
      const enumKey = messageObj[key];
      enumObj[key] = SysHelper.getLang(lang)[enumKey];
    });

    return enumObj;
  };
}
