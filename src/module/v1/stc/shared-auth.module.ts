import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '../../share/config/config.module';
import { ConfigService } from '../../share/config/config.service';
import { SimpleJwtGuard } from '../guard/simple-jwt.guard';

@Global()
@Module({
  imports: [
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
  providers: [SimpleJwtGuard],
  exports: [JwtModule, SimpleJwtGuard],
})
export class SharedAuthModule {} 