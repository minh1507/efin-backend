import { Injectable } from '@nestjs/common';
import { VaultService } from '../vault/vault.service';
import IGlobal from 'src/master/global/global.interface';

@Injectable()
export class ConfigService {
  constructor(private readonly vaultService: VaultService) {}

  async getConfig(): Promise<IGlobal> {
    return await this.vaultService.getSecret();
  }
}
