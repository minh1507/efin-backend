import { Module } from '@nestjs/common';
import { EthnicService } from './ethnic.service';
import { EthnicController } from './ethnic.controller';
import { EthnicRepository } from './ethnic.repository';
import { Ethnic } from './ethnic.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponseClient } from '../../../../../common/response/success.response';

@Module({
  imports: [TypeOrmModule.forFeature([Ethnic])],
  controllers: [EthnicController],
  providers: [EthnicService, EthnicRepository, ResponseClient],
  exports: [EthnicService],
})
export class EthnicModule {}
