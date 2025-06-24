import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface VaultClient {
  read(path: string): Promise<VaultResponse>;
}

export interface VaultResponse {
  data: {
    data: Record<string, unknown>;
  };
}

export interface VaultSecret {
  [key: string]: unknown;
}

@Injectable()
export class VaultService {
  private readonly logger = new Logger(VaultService.name);

  constructor(
    @Inject('VAULT_CLIENT') private readonly vaultClient: VaultClient,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Fetch secret from Vault
   */
  async getSecret(path?: string): Promise<VaultSecret> {
    try {
      const secretPath = path || this.configService.get<string>('MAIN.PATH');
      
      if (!secretPath) {
        throw new Error('Vault secret path not configured');
      }

      this.logger.debug(`Fetching secret from Vault path: ${secretPath}`);
      
      const secret = await this.vaultClient.read(secretPath);
      
      if (!secret?.data?.data) {
        throw new Error('Invalid secret response from Vault');
      }

      const secretData = secret.data.data;
      this.logger.debug('Successfully fetched secret from Vault');
      
      return secretData;
    } catch (error) {
      this.logger.error('Error fetching secret from Vault:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Vault secret fetch error: ${errorMessage}`);
    }
  }

  /**
   * Get specific secret value by key
   */
  async getSecretValue<T = string>(key: string, path?: string): Promise<T | null> {
    try {
      const secrets = await this.getSecret(path);
      const value = secrets[key];
      
      if (value === undefined) {
        this.logger.warn(`Secret key '${key}' not found`);
        return null;
      }
      
      return value as T;
    } catch (error) {
      this.logger.error(`Error fetching secret value for key '${key}':`, error);
      throw error;
    }
  }

  /**
   * Check if Vault client is properly configured
   */
  isConfigured(): boolean {
    return !!this.vaultClient && !!this.configService.get('MAIN.PATH');
  }
}
