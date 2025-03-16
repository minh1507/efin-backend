import { Module } from '@nestjs/common';
import { CacheModule, CacheModuleOptions } from '@nestjs/cache-manager';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { CachingService } from './cache.service';
import KeyvRedis from '@keyv/redis';
import Keyv from 'keyv';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<CacheModuleOptions> => {
        try {
          const config = await configService.getConfig();

          const redisStore = new KeyvRedis(
            `redis://${config['REDIS.HOST']}:${config['REDIS.PORT']}`,
          );
          const keyv = new Keyv({ store: redisStore });

          return {
            stores: [keyv],
          };
        } catch (error) {
          console.error('Redis connection failed:', error);
          throw error;
        }
      },
    }),
  ],
  providers: [CachingService],
  exports: [CachingService],
})
export class CachingModule {}
