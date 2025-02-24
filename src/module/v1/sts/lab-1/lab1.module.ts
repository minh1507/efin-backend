import { Module } from '@nestjs/common';
import { Lab1Controller } from './lab1.controller';
import { Lab1Service } from './lab1.service';
import { ResponseClient } from '../../../../common/response/success.response';
import { Lab1Api } from './lab1.api';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Leds } from './entities/leds.entity';
import { Lab1Repository } from './lab1.repository';
import { Wifi } from './entities/wifi.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Leds, Wifi])],
  controllers: [Lab1Controller],
  providers: [Lab1Service, ResponseClient, Lab1Api, Lab1Repository],
  exports: [],
})
export class Lab1Module {}
