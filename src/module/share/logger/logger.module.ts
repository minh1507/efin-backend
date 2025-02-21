import { Global, Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { TraceIdService } from '../trace/trace.service';

@Global()
@Module({
  providers: [LoggerService, TraceIdService],
  exports: [LoggerService, TraceIdService],
})
export class LoggerModule {}
