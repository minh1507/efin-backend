import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { LoggerService } from 'src/module/share/logger/logger.service';
import { Leds } from './entities/leds.entity';
import { SetLeds } from './lab1.dto';
import { Wifi } from './entities/wifi.entity';

@Injectable()
export class Lab1Repository {
  constructor(
    @InjectRepository(Leds) private ledRepository: Repository<Leds>,
    @InjectRepository(Wifi) private wifiRepository: Repository<Wifi>,
    private readonly logger: LoggerService,
  ) {}

  public findMany = async (): Promise<Leds[]> => {
    this.logger.trace('Start check exist account', 'REPOSITORY');

    const query = this.ledRepository.createQueryBuilder('A').orderBy('A.name');

    return await query.getMany();
  };

  public setLeds = async (param: SetLeds): Promise<void> => {
    this.logger.trace('Start check exist account', 'REPOSITORY');

    const ledName = param.leds.map((u) => u.name);

    const leds = await this.ledRepository.find({
      where: {
        name: In(ledName),
      },
    });

    leds.forEach((led) => {
      led.status =
        param.leds.filter((u) => u.name == led.name)[0].status == 'on';

      this.ledRepository.save(led);
    });
  };

  public getWifi = async (): Promise<any> => {
    return {
      status: (await this.wifiRepository.find())[0].status ? 'on' : 'off',
    };
  };

  public setWifi = async (status: boolean): Promise<void> => {
    const wifi = (await this.wifiRepository.find())[0];

    wifi.status = status;

    await this.wifiRepository.save(wifi);
  };

  public resetWifi = async (): Promise<void> => {
    const leds = await this.ledRepository.find();

    leds.map((led) => {
      return {
        ...led,
        status: false,
      };
    });

    await this.ledRepository.save(leds);
  };
}
