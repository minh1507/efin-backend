import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoggerService } from 'src/module/share/logger/logger.service';
import { RefreshToken } from './refresh-token.entity';

@Injectable()
export class RefreshTokenRepository {
  constructor(
    @InjectRepository(RefreshToken) private repository: Repository<RefreshToken>,
    private readonly logger: LoggerService,
  ) {}

  public save = async (data: object): Promise<void> => {
    this.logger.trace('Start save exist refresh token', 'REPOSITORY');

    const query = this.repository.save(data);
  };
}
