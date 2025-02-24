import { Module } from '@nestjs/common';
import { EthnicService } from './ethnic.service';
import { EthnicController } from './ethnic.controller';
import { EthnicRepository } from './ethnic.repository';
import { Ethnic } from './ethnic.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponseClient } from '../../../../../common/response/success.response';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '../../../../share/config/config.module';
import { ConfigService } from '../../../../share/config/config.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ethnic]),
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
  controllers: [EthnicController],
  providers: [EthnicService, EthnicRepository, ResponseClient],
  exports: [EthnicService],
})
export class EthnicModule {}
