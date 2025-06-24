import { DataSource } from 'typeorm';
import { runSeeder, Seeder } from 'typeorm-extension';
import { Logger } from '@nestjs/common';

import RoleSeeder from './role.seed';
import SecretSeeder from './secret.seed';
import UserSeeder from './user.seed';
import ClientSeeder from './client.seed';
import PermissionSeeder from './permission.seed';

export default class MainSeeder implements Seeder {
  private readonly logger = new Logger(MainSeeder.name);

  public async run(dataSource: DataSource): Promise<void> {
    try {
      this.logger.log('🌱 Starting Auth Server seeding process...');
      this.logger.log('ℹ️  Using safe seeding mode - only creating missing data');
      
      // Run seeders in correct dependency order
      this.logger.log('🌱 Checking Permissions...');
      await runSeeder(dataSource, PermissionSeeder);
      
      this.logger.log('🌱 Checking Roles...');
      await runSeeder(dataSource, RoleSeeder);
      
      this.logger.log('🌱 Checking Secrets...');
      await runSeeder(dataSource, SecretSeeder);
      
      this.logger.log('🌱 Checking Users...');
      await runSeeder(dataSource, UserSeeder);
      
      this.logger.log('🌱 Checking Clients...');
      await runSeeder(dataSource, ClientSeeder);
      
      this.logger.log('✅ Auth Server seeding process completed successfully!');
    } catch (error) {
      this.logger.error('❌ Seeding failed:', error);
      throw error;
    }
  }
}
