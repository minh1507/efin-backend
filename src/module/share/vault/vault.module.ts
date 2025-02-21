import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import NodeVault from 'node-vault';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: 'VAULT_CLIENT',
      useFactory: async (configService: ConfigService) => {
        return NodeVault({
          endpoint: configService.get('MAIN.DOMAIN'),
          token: configService.get('MAIN.SECRET'),
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: ['VAULT_CLIENT'],
})
export class VaultModule {}
