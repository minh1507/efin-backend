import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ResponseClient } from 'src/common/response/success.response';
import { LoggerService } from 'src/module/share/logger/logger.service';
import { TagEnum } from 'src/common/enum/tag.enum';
import SysHelper from 'src/util/sys.util';
import { Lab1Service } from './lab1.service';
import { SetLeds, SetWifi } from './lab1.dto';

@Controller(SysHelper.getPath(__dirname))
@ApiTags(TagEnum.LAB_1)
export class Lab1Controller {
  constructor(
    private readonly logger: LoggerService,
    private readonly response: ResponseClient,
    private readonly lab1Service: Lab1Service,
  ) {}

  @Post('/set-leds')
  public async setLeds(@Body() param: SetLeds) {
    this.logger.trace(`Start action esp server`, 'CONTROLLER');

    await this.lab1Service.setLeds(param);

    return this.response.base('POST');
  }

  @Get('/get-leds')
  public async getLeds() {
    this.logger.trace(`Start action esp server`, 'CONTROLLER');

    const reponse = await this.lab1Service.getLeds();

    return this.response.base('GET', reponse);
  }

  @Post('/set-wifi')
  public async setWifi(@Body() param: SetWifi) {
    this.logger.trace(`Start action esp server`, 'CONTROLLER');

    await this.lab1Service.setWifi(param);

    return this.response.base('POST');
  }

  @Post('/reset-wifi')
  public async resetWifi() {
    this.logger.trace(`Start action esp server`, 'CONTROLLER');

    await this.lab1Service.resetWifi();

    return this.response.base('POST');
  }

  @Get('/wifi-status')
  public async status() {
    this.logger.trace(`Start action esp server`, 'CONTROLLER');

    const response = await this.lab1Service.status();

    return this.response.base('GET', response);
  }

  @Get('/dht')
  public async dht() {
    this.logger.trace(`Start action esp server`, 'CONTROLLER');

    const response = await this.lab1Service.dht();

    return this.response.base('GET', response);
  }
}
