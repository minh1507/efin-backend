import { Injectable } from '@nestjs/common';
import { Ethnic } from './ethnic.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoggerService } from 'src/module/share/logger/logger.service';
import { CreateEthnicDto, FindDto } from './ethnic.dto';
import { paginate } from 'src/module/v1/helper/pagination.helper';
import { PaginationResult } from 'src/module/v1/base/dto.base';

@Injectable()
export class EthnicRepository {
  constructor(
    @InjectRepository(Ethnic) private repository: Repository<Ethnic>,
    private readonly logger: LoggerService,
  ) {}

  public find = async (param: FindDto): Promise<PaginationResult<Ethnic>> => {
    this.logger.trace('Start find all ethnics', 'REPOSITORY');

    const query = this.repository
      .createQueryBuilder('ethnic')
      .skip((param.page - 1) * param.limit)
      .take(param.limit)
      .orderBy('LOWER(ethnic.name)', 'ASC');

    return paginate(query, param);
  };

  public create = async (param: CreateEthnicDto): Promise<Ethnic> => {
    this.logger.trace('Start create ethnic', 'REPOSITORY');

    return this.repository.save(param);
  };

  public exist = async (code: string): Promise<boolean> => {
    this.logger.trace('Start check exist ethnic', 'REPOSITORY');

    return await this.repository.exists({
      where: {
        code: code,
      },
    });
  };
}
