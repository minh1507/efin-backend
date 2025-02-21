import { join } from 'path';
import { randomBytes } from 'crypto';
import { Vi } from 'src/common/trans/vi';
import { En } from 'src/common/trans/en';
import * as path from 'path';

export default class SysHelper {
  static pathConfig = (path: string, type: 'entity' | 'schemas'): string => {
    return join(__dirname, '..', '..', 'src', path, `/**/*.${type}{.ts,.js}`);
  };

  static prefix = (path: string): any => {
    const root = path.split('\\');
    return root[root.length - 1];
  };

  static typeof = (value) => Object.prototype.toString.call(value).slice(8, -1);

  static getSecureRandomIndex(max: number): number {
    const randomBytesBuffer = randomBytes(4);
    const randomNumber = randomBytesBuffer.readUInt32BE(0);
    return randomNumber % max;
  }

  static getLang(lang: string) {
    if (lang === 'en') {
      return En;
    } else {
      return Vi;
    }
  }

  static getPath(dir: string): string {
    const absolutePath = path.resolve(dir);

    const keyword = 'module';
    const index = absolutePath.indexOf(keyword);

    if (index === -1) {
      throw new Error('"module/" not found in the provided path');
    }

    const relativePath = absolutePath
      .substring(index + keyword.length)
      .replace(/\\/g, '/');

    const pathSegments = relativePath.split('/');
    pathSegments.pop();

    return 'api' + pathSegments.join('/');
  }
}
