import { LoggerService } from '../../module/share/logger/logger.service';
import { Injectable } from '@nestjs/common';
import { MessageEnum } from '../enum/message.enum';

@Injectable()
export class ResponseClient {
  constructor(private readonly logger: LoggerService) { }

  base = (
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
    data: object | object[] | null = null,
    flag: boolean = true,
    mes: string | null = null
  ) => {
    return {
      status: {
        code: method != 'POST' ? 200 : 201,
        success: true,
      },
      message: {
        success: mes ? mes : MessageEnum.ACTION_SUCCESS,
      },
      data: data,
      ui: {
        flag: method == 'GET' ? false : flag,
      },
      trace: {
        id: this.logger.getTraceId(),
      },
      m: "kk"
    };
  };
}
