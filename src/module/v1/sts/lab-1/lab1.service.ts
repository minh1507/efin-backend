import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/module/share/logger/logger.service';
import { Lab1Api } from './lab1.api';
import { SetLeds, SetWifi } from './lab1.dto';
import { Lab1Repository } from './lab1.repository';
import { Leds } from './entities/leds.entity';

@Injectable()
export class Lab1Service {
  constructor(
    private readonly logger: LoggerService,
    private readonly lab1Api: Lab1Api,
    private readonly labRepository: Lab1Repository,
  ) {}

  public setLeds = async (param: SetLeds): Promise<void> => {
    this.logger.trace(`[SERVICE] Start action into esp server`);

    this.labRepository.setLeds(param);

    await this.lab1Api.setLeds(param);
  };

  public getLeds = async (): Promise<Leds[]> => {
    this.logger.trace(`[SERVICE] Start action into esp server`);

    return await this.labRepository.findMany();
  };

  public setWifi = async (param: SetWifi): Promise<void> => {
    this.logger.trace(`[SERVICE] Start action into esp server`);

    await this.labRepository.setWifi(true);

    await this.lab1Api.setWifi(param);
  };

  public resetWifi = async (): Promise<void> => {
    this.logger.trace(`[SERVICE] Start action into esp server`);

    await this.labRepository.setWifi(false);

    await this.labRepository.resetWifi();

    await this.lab1Api.resetWifi();
  };

  public status = async (): Promise<any> => {
    this.logger.trace(`[SERVICE] Start action into esp server`);

    return await this.labRepository.getWifi();
  };
}
