import { Injectable, Scope } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable({ scope: Scope.REQUEST })
export class TraceIdService {
  private traceId: string;

  constructor() {
    this.traceId = uuidv4();
  }

  getTraceId(): string {
    return this.traceId;
  }
}
