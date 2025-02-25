import { Module } from '@nestjs/common';
import { CacheModule, CacheModuleOptions } from '@nestjs/cache-manager';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { CachingService } from './cache.service';
import { redisStore } from "cache-manager-redis-store";

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService): Promise<CacheModuleOptions> => {
        const config = await configService.getConfig();

        const store = await redisStore({
          socket: {
            host: config['REDIS.HOST'],
            port: Number(config['REDIS.PORT']),
          },
        });

        return {
          store,
          ttl: 5,
        };
      },
    }),
  ],
  providers: [CachingService],
  exports: [CachingService],
})
export class CachingModule {}
