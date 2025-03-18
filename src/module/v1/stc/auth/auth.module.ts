import { Module } from '@nestjs/common';
import { JwtAuthController } from './controller/jwt-auth.controller';
import { ResponseClient } from '../../../../common/response/success.response';
import { JwtAuthService } from './service/jwt-auth.service';
import { UserModule } from '../category/user/user.module';
import { SecretModule } from '../category/secret/secret.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '../../../share/config/config.module';
import { ConfigService } from '../../../share/config/config.service';
import { JwtAuthGuard } from '../../guard/auth.guard';
import { CachingModule } from '../../../share/cache/cache.module';
import { RefreshTokenModule } from '../refresh-token/refresh-token.module';

@Module({
  imports: [
    UserModule,
    SecretModule,
    RefreshTokenModule,
    CachingModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: (await configService.getConfig())['TOKEN.SECRET.KEY'],
          signOptions: { expiresIn: '1h' },
        };
      },
    }),
  ],
  controllers: [JwtAuthController],
  providers: [ResponseClient, JwtAuthService, JwtAuthGuard],
  exports: [JwtAuthGuard],
})
export class AuthModule {}
