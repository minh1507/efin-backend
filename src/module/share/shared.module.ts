import { Module } from '@nestjs/common';
import { VaultModule } from './vault/vault.module';
import { ConfigModule } from './config/config.module';
import { MinioModule } from './minio/minio.module';
import { LoggerModule } from './logger/logger.module';
import { CachingModule } from './cache/cache.module';

@Module({
  imports: [
    ConfigModule,
    VaultModule,
    MinioModule,
    LoggerModule,
    CachingModule,
  ],
})
export class SharedModule {}
