import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ResponseClient } from 'src/common/response/success.response';
import { LoggerService } from 'src/module/share/logger/logger.service';
import { TagEnum } from 'src/common/enum/tag.enum';
import SysHelper from 'src/util/sys.util';
import { EthnicService } from './ethnic.service';
import { CreateEthnicDto, FindDto } from './ethnic.dto';
import { IRequestWithLang } from 'src/common/interface/lang.interface';

@Controller(SysHelper.getPath(__dirname))
@ApiTags(TagEnum.ETHNIC)
export class EthnicController {
  constructor(
    private readonly ethnicService: EthnicService,
    private readonly logger: LoggerService,
    private readonly response: ResponseClient,
  ) {}

  @Get()
  public async find(@Query() param: FindDto) {
    this.logger.trace(
      `Start find all ethnics with param: ${JSON.stringify(param)}`,
      'CONTROLLER',
    );

    const result = await this.ethnicService.find(param);

    return this.response.base('GET', result);
  }

  @Post()
  public async create(
    @Body() param: CreateEthnicDto,
    @Req() req: IRequestWithLang,
  ) {
    this.logger.trace(
      `Start creat ethnic with param: ${JSON.stringify(param)}`,
      'CONTROLLER',
    );

    console.log(req.lang);

    await this.ethnicService.create(param);

    return this.response.base('POST');
  }
}
