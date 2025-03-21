import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ResponseClient } from 'src/common/response/success.response';
import { LoggerService } from 'src/module/share/logger/logger.service';
import { TagEnum } from 'src/common/enum/tag.enum';
import SysHelper from 'src/util/sys.util';
import { CreateMenuDto } from './menu.dto';
import { MenuService } from './menu.service';

@Controller(SysHelper.getPath(__dirname))
@ApiTags(TagEnum.MENU)
export class MenuController {
  constructor(
    private readonly menuService: MenuService,
    private readonly logger: LoggerService,
    private readonly response: ResponseClient,
  ) {}

  @Post()
  public async create(@Body() param: CreateMenuDto) {
    this.logger.trace(
      `Start create menu with param: ${JSON.stringify(param)}`,
      'CONTROLLER',
    );

    await this.menuService.create(param);

    return this.response.base('POST');
  }

  @Get()
  public async findTree() {
    this.logger.trace(
      `Start get menu`,
      'CONTROLLER',
    );

    const response = await this.menuService.findTree();

    return this.response.base('GET', response);
  }
}
