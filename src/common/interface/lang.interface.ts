import { Request } from 'express';

export interface IRequestWithLang extends Request {
  lang: string;
  tenant: string;
}
