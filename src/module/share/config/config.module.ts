import { Module, Global } from '@nestjs/common';
import { ConfigService } from './config.service';
import { VaultModule } from '../vault/vault.module';
import { VaultService } from '../vault/vault.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getPostgresOptions } from 'src/config/data-source.config';

@Global()
@Module({
  imports: [
    VaultModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async () => {
        return getPostgresOptions();
      },
    }),
  ],
  providers: [ConfigService, VaultService],
  exports: [ConfigService],
})
export class ConfigModule {}
