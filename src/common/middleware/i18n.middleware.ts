import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { IRequestWithLang } from '../interface/lang.interface';

@Injectable()
export class I18nMiddleware implements NestMiddleware {
  use(req: IRequestWithLang, res: Response, next: NextFunction) {
    const lang =
      req.headers['accept-language']?.toString().split(',')[0] ||
      req.query.lang?.toString() ||
      req.cookies?.lang ||
      'vi';

    const tenant =
      req.headers['x-tenant-id']?.toString() ||
      req.query.tenant?.toString() ||
      req.cookies?.tenant ||
      'default_tenant';

    req.lang = lang;
    req.tenant = tenant;

    next();
  }
}
