import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ResponseClient } from '../../../../common/response/success.response';
import { AuthService } from './auth.service';
import { UserModule } from '../category/user/user.module';
import { SecretModule } from '../category/secret/secret.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '../../../share/config/config.module';
import { ConfigService } from '../../../share/config/config.service';
import { JwtAuthGuard } from '../../guard/auth.guard';
import { CachingModule } from '../../../share/cache/cache.module';

@Module({
  imports: [
    UserModule,
    SecretModule,
    CachingModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        console.log((await configService.getConfig())['TOKEN.SECRET.KEY']);
        return {
          secret: (await configService.getConfig())['TOKEN.SECRET.KEY'],
          signOptions: { expiresIn: '1h' },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [ResponseClient, AuthService, JwtAuthGuard],
  exports: [JwtAuthGuard],
})
export class AuthModule {}
