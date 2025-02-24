import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class CachingService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async setCache(key: string, value: any, ttl = 60) {
    await this.cacheManager.set(key, value, ttl);
    console.log(`✅ Cached: ${key} = ${value}`);
  }

  async getCache(key: string) {
    const value = await this.cacheManager.get(key);
    console.log(`🔹 Fetched from cache: ${key} = ${value}`);
    return value ?? 'No cache found';
  }

  async deleteCache(key: string) {
    await this.cacheManager.del(key);
    console.log(`❌ Deleted cache key: ${key}`);
  }
}
