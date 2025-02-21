import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VaultService {
  private configService: ConfigService;

  constructor(@Inject('VAULT_CLIENT') private readonly vaultClient: any) {
    this.configService = new ConfigService();
  }

  async getSecret(): Promise<any> {
    try {
      const secret = await this.vaultClient.read(
        this.configService.get('MAIN.PATH'),
      );
      const secretData = secret.data.data;

      return secretData;
    } catch (error) {
      console.error('Error fetching secret from Vault:', error);
      throw new Error('Vault secret fetch error');
    }
  }
}
