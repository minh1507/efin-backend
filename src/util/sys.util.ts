import * as path from 'path';
import { join } from 'path';
import { randomBytes } from 'crypto';
import { Vi } from '@/common/trans/vi';
import { En } from '@/common/trans/en';

type FileExtension = 'entity' | 'schemas';
type SupportedLanguage = 'en' | 'vi';

export default class SysHelper {
  /**
   * Generates path configuration for TypeORM entities or schemas
   */
  static pathConfig(targetPath: string, type: FileExtension): string {
    return join(__dirname, '..', '..', 'src', targetPath, `/**/*.${type}{.ts,.js}`);
  }

  /**
   * Extracts the last segment from a file path
   */
  static prefix(filePath: string): string {
    const pathSegments = filePath.split('\\');
    return pathSegments[pathSegments.length - 1];
  }

  /**
   * Gets the type of a value as a string
   */
  static typeof(value: unknown): string {
    return Object.prototype.toString.call(value).slice(8, -1);
  }

  /**
   * Generates a cryptographically secure random index
   */
  static getSecureRandomIndex(max: number): number {
    if (max <= 0) {
      throw new Error('Max value must be greater than 0');
    }
    
    const randomBytesBuffer = randomBytes(4);
    const randomNumber = randomBytesBuffer.readUInt32BE(0);
    return randomNumber % max;
  }

  /**
   * Gets language translation object based on language code
   */
  static getLang(lang: SupportedLanguage) {
    const langMap = {
      en: En,
      vi: Vi,
    } as const;

    return langMap[lang] || Vi; // Default to Vietnamese
  }

  /**
   * Constructs API path from directory structure
   */
  static getPath(dir: string, subPath?: string): string {
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
    const filteredSegments = pathSegments.filter(
      (segment) => segment !== 'controller',
    );

    const basePath = 'api' + filteredSegments.join('/');
    
    return subPath ? `${basePath}/${subPath}` : basePath;
  }
}
