import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CachingService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async setCache(key: string, value: any, ttl = 5000) {
    await this.cacheManager.set(key, value, ttl);
  }

  async getCache(key: string) {
    const value = await this.cacheManager.get(key);
    return value ? JSON.parse(<string>value) : null;
  }

  async deleteCache(key: string) {
    await this.cacheManager.del(key);
  }
}
