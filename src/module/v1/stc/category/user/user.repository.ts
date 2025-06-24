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

  public exist = async (username: string, clientId?: string): Promise<boolean> => {
    this.logger.trace('Start check exist account', 'REPOSITORY');

    const query = this.repository
      .createQueryBuilder('A')
      .where('A.username = :username', { username });

    if (clientId) {
      query.andWhere('A.clientId = :clientId', { clientId });
    }

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

  public findByUsernameAndClient = async (username: string, clientId: string): Promise<User | null> => {
    this.logger.trace('Start find by username and client', 'REPOSITORY');

    const query = this.repository
      .createQueryBuilder('A')
      .innerJoinAndSelect('A.role', 'B')
      .innerJoinAndSelect('A.secret', 'C')
      .innerJoinAndSelect('A.client', 'E')
      .leftJoinAndSelect('A.refreshToken', 'D')
      .where('A.username = :username', { username })
      .andWhere('A.clientId = :clientId', { clientId })
      .andWhere('A.isActive = :isActive', { isActive: true });

    return await query.getOne();
  };

  public findByRefreshToken = async (refreshToken: string): Promise<User | null> => {
    this.logger.trace('Start find by refresh token', 'REPOSITORY');

    const query = this.repository
      .createQueryBuilder('A')
      .innerJoinAndSelect('A.role', 'B')
      .innerJoinAndSelect('A.secret', 'C')
      .innerJoinAndSelect('A.client', 'E')
      .innerJoinAndSelect('A.refreshToken', 'D')
      .where('D.key = :refreshToken', { refreshToken })
      .andWhere('A.isActive = :isActive', { isActive: true });

    return await query.getOne();
  };

  public save = async (user: User): Promise<User> => {
    this.logger.trace('Start save user', 'REPOSITORY');
    return await this.repository.save(user);
  };
}
