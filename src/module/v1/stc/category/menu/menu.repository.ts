import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TreeRepository } from 'typeorm';
import { LoggerService } from 'src/module/share/logger/logger.service';
import { Menu } from './menu.entity';

@Injectable()
export class MenuRepository {
  constructor(
    @InjectRepository(Menu) private repository: Repository<Menu>,
    @InjectRepository(Menu) private treeRepository: TreeRepository<Menu>,
    private readonly logger: LoggerService,
  ) {}

  public create = async (param: object): Promise<Menu> => {
    this.logger.trace('Start create menu', 'REPOSITORY');

    return this.repository.save(param);
  };

  public findOneById = async (id: string): Promise<Menu | null> => {
    this.logger.trace('Start find one menu', 'REPOSITORY');

    return this.repository.findOne({
      where: {
        id: id
      }
    });
  };

  public findTree = async () => {
    this.logger.trace('Start find tree menu', 'REPOSITORY');

    const root = await this.repository.findOne({
      where: {
        parent: undefined
      }
    })


    console.log(root)
    if(!root) return

    return await this.treeRepository.findDescendantsTree(root);
  }
}
