import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoggerService } from 'src/module/share/logger/logger.service';
import { Secret } from './secret.entity';

@Injectable()
export class SecretRepository {
  constructor(
    @InjectRepository(Secret) private repository: Repository<Secret>,
    private readonly logger: LoggerService,
  ) {}

  public findByUser = async (username: string): Promise<Secret | null> => {
    this.logger.trace('Start check exist password by user', 'REPOSITORY');

    const query = this.repository
      .createQueryBuilder('A')
      .innerJoinAndSelect('A.user', 'B')
      .where('B.username = :username', { username: username })
      .select(['A.id', 'A.password']);

    return await query.getOne();
  };
}
