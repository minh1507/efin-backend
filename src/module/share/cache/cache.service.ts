import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';

export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
}

@Injectable()
export class CachingService {
  private readonly logger = new Logger(CachingService.name);

  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  /**
   * Set cache value with optional TTL
   */
  async setCache<T>(key: string, value: T, ttl: number = 5000): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      await this.cacheManager.set(key, serializedValue, ttl);
      this.logger.debug(`Cache set for key: ${key}`);
    } catch (error) {
      this.logger.error(`Failed to set cache for key: ${key}`, error);
      throw error;
    }
  }

  /**
   * Get cache value with type safety
   */
  async getCache<T>(key: string): Promise<T | null> {
    try {
      const value = await this.cacheManager.get<string>(key);
      
      if (!value) {
        this.logger.debug(`Cache miss for key: ${key}`);
        return null;
      }

      try {
        const parsedValue = JSON.parse(value) as T;
        this.logger.debug(`Cache hit for key: ${key}`);
        return parsedValue;
      } catch (parseError) {
        this.logger.error(`Failed to parse cache value for key: ${key}`, parseError);
        return null;
      }
    } catch (error) {
      this.logger.error(`Failed to get cache for key: ${key}`, error);
      return null;
    }
  }

  /**
   * Delete cache entry
   */
  async deleteCache(key: string): Promise<void> {
    try {
      await this.cacheManager.del(key);
      this.logger.debug(`Cache deleted for key: ${key}`);
    } catch (error) {
      this.logger.error(`Failed to delete cache for key: ${key}`, error);
      throw error;
    }
  }

  /**
   * Check if cache key exists
   */
  async hasCache(key: string): Promise<boolean> {
    try {
      const value = await this.cacheManager.get(key);
      return value !== undefined && value !== null;
    } catch (error) {
      this.logger.error(`Failed to check cache existence for key: ${key}`, error);
      return false;
    }
  }


}
