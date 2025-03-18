import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoggerService } from 'src/module/share/logger/logger.service';
import { User } from './user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User) private repository: Repository<User>,
    private readonly logger: LoggerService,
  ) {}

  public exist = async (username: string): Promise<boolean> => {
    this.logger.trace('Start check exist account', 'REPOSITORY');

    const query = this.repository
      .createQueryBuilder('A')
      .where('A.username = :username', { username: username });

    return await query.getExists();
  };

  public findByUsername = async (username: string): Promise<User | null> => {
    this.logger.trace('Start find by username', 'REPOSITORY');

    const query = this.repository
      .createQueryBuilder('A')
      .innerJoinAndSelect('A.role', 'B')
      .innerJoinAndSelect('A.secret', 'C')
      .leftJoinAndSelect('A.refreshToken', 'D')
      .where('A.username = :username', { username: username });

    return await query.getOne();
  };
}
