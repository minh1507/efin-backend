import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/module/share/logger/logger.service';
import { CreateMenuDto } from './menu.dto';
import { MenuRepository } from './menu.repository';
import { BadRequestException } from 'src/common/exeption/bad-request.exeption';
import { MessageEnum } from 'src/common/enum/message.enum';

@Injectable()
export class MenuService {
  constructor(
    private readonly logger: LoggerService,
    private readonly menuRepository: MenuRepository,
  ) {}

  public create = async (param: CreateMenuDto): Promise<void> => {
    this.logger.trace(`[SERVICE] Start create menu`);

    param["parent"] = null 

    if(param.parentId){
      const parent = await this.menuRepository.findOneById(param.parentId)

      if(!parent) throw new BadRequestException(MessageEnum.PARENT_NOT_EXIST, this.logger);

      param['parent'] = parent
    }

    await this.menuRepository.create(param);
  };

  public findTree = async () => {
    this.logger.trace(`[SERVICE] Start find tree menu`);

    return await this.menuRepository.findTree();
  }
}
