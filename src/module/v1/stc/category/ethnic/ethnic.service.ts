import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/module/share/logger/logger.service';
import { EthnicRepository } from './ethnic.repository';
import { Ethnic } from './ethnic.entity';
import { CreateEthnicDto, FindDto } from './ethnic.dto';
import { PaginationResult } from 'src/module/v1/base/dto.base';
import { BadRequestException } from 'src/common/exeption/bad-request.exeption';

@Injectable()
export class EthnicService {
  constructor(
    private readonly logger: LoggerService,
    private readonly ethnicRepository: EthnicRepository,
  ) {}

  public find = async (param: FindDto): Promise<PaginationResult<Ethnic>> => {
    this.logger.trace(`[SERVICE] Start find all ethnics`);

    const result = await this.ethnicRepository.find(param);

    this.logger.trace(`[SERVICE] Found ${result.content.length} ethnics`);

    return result;
  };

  public create = async (param: CreateEthnicDto): Promise<void> => {
    this.logger.trace(`[SERVICE] Start create ethnic`);

    const isExist = await this.ethnicRepository.exist(param.code);

    if (isExist) throw new BadRequestException('Code has existed', this.logger);

    const result = await this.ethnicRepository.create(param);

    this.logger.trace(
      `[SERVICE] Create ethnic with id=${result.id} successfully`,
    );
  };
}
