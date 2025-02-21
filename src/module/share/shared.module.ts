import { Module } from '@nestjs/common';
import { VaultModule } from './vault/vault.module';
import { ConfigModule } from './config/config.module';
import { MinioModule } from './minio/minio.module';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [ConfigModule, VaultModule, MinioModule, LoggerModule],
})
export class SharedModule {}
