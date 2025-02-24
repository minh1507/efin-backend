import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { CachingService } from './cache.service';
import * as redisStore from 'cache-manager-redis-store'; // ✅ Import correctly

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const config = await configService.getConfig();

        return {
          store: redisStore,
          socket: {
            host: config['REDIS.HOST'],
            port: Number(config['REDIS.PORT']),
          },
          ttl: 5,
        };
      },
    }),
  ],
  providers: [CachingService],
  exports: [CachingService],
})
export class CachingModule {}
