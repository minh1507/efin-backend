import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from './refresh-token.entity';

@Injectable()
export class RefreshTokenRepository {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly repository: Repository<RefreshToken>,
  ) {}

  async save(data: Partial<RefreshToken>): Promise<RefreshToken> {
    return await this.repository.save(data);
  }

  async findOne(conditions: Partial<RefreshToken>): Promise<RefreshToken | null> {
    return await this.repository.findOne({ where: conditions });
  }

  async remove(token: RefreshToken): Promise<void> {
    await this.repository.remove(token);
  }
}
