import { Trans } from '../trans/trans';
import { LoggerService } from '../../module/share/logger/logger.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ResponseClient {
  constructor(private readonly logger: LoggerService) {}

  base = (
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
    data: object | object[] | null = null,
    flag: boolean = true,
  ) => {
    return {
      status: {
        code: method != 'POST' ? 200 : 201,
        success: true,
      },
      message: {
        success: Trans.RA_RESPONSE_SUCCESS,
      },
      data: data,
      ui: {
        flag: method == 'GET' ? false : flag,
      },
      trace: {
        id: this.logger.getTraceId(),
      },
    };
  };
}
