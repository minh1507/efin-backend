import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Logger } from '@nestjs/common';
import { Secret } from '../../module/v1/stc/category/secret/secret.entity';

export default class SecretSeeder implements Seeder {
  private readonly logger = new Logger(SecretSeeder.name);

  public async run(dataSource: DataSource): Promise<void> {
    try {
      this.logger.log('🌱 Starting Secret seeding...');
      
      const repository = dataSource.getRepository(Secret);

      // Count existing secrets for information
      const existingCount = await repository.count();
      
      if (existingCount > 0) {
        this.logger.log(`ℹ️  Found ${existingCount} existing secrets - keeping them intact`);
      } else {
        this.logger.log('ℹ️  No existing secrets found');
      }
      
      this.logger.log('✅ Secret seeding completed (no default secrets created for security)');
    } catch (error) {
      this.logger.error('❌ Secret seeding failed:', error);
      throw error;
    }
  }
}

/**
 * Example secret for reference (password: Minlvip123!)
 * This is not automatically seeded for security reasons
 */
export const SECRET_ADMIN: Partial<Secret> = {
  password: '$2a$12$lwsseM8VJ7EnP1lxFO4qq.P6GGvasXCNfBn.AQhTEFiYrhRDqTtje',
};
