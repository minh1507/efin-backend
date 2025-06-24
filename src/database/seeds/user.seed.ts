import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '../../module/v1/stc/category/user/user.entity';
import { Role } from '../../module/v1/stc/category/role/role.entity';
import { Secret } from '../../module/v1/stc/category/secret/secret.entity';
import { Client } from '../../module/v1/stc/client/client.entity';

export default class UserSeeder implements Seeder {
  private readonly logger = new Logger(UserSeeder.name);

  public async run(dataSource: DataSource): Promise<void> {
    try {
      const userRepository = dataSource.getRepository(User);
      const roleRepository = dataSource.getRepository(Role);
      const secretRepository = dataSource.getRepository(Secret);
      const clientRepository = dataSource.getRepository(Client);

      // Get all clients
      const clients = await clientRepository.find();
      if (clients.length === 0) {
        this.logger.log('⚠️  No clients found, skipping user seeding');
        return;
      }

      // Check if users already exist
      const existingUsersCount = await userRepository.count();
      if (existingUsersCount > 0) {
        this.logger.log('✅ Users already exist, skipping user seeding');
        return;
      }

      // Create admin user for each client
      for (const client of clients) {
        this.logger.log(`🔄 Creating admin user for client: ${client.name}`);
        
        // Find admin role for this client
        const adminRole = await roleRepository.findOne({
          where: { 
            code: 'ADMIN',
            clientId: client.id 
          },
        });

        if (!adminRole) {
          this.logger.warn(`⚠️  Admin role not found for client ${client.name}. Skipping user creation.`);
          continue;
        }

        // Check if admin user already exists for this client
        const existingAdmin = await userRepository.findOne({
          where: { 
            username: `admin-${client.clientId}`,
            clientId: client.id 
          },
        });

        if (existingAdmin) {
          this.logger.log(`ℹ️  Admin user already exists for ${client.name}`);
          continue;
        }

        const hashedPassword = await bcrypt.hash('Admin123!', 12);
        
        const secret = secretRepository.create({
          password: hashedPassword,
        });
        const savedSecret = await secretRepository.save(secret);

        const adminUser = userRepository.create({
          clientId: client.id,
          username: `admin-${client.clientId}`,
          email: `admin@${client.clientId}.local`,
          fullName: `${client.name} Administrator`,
          isActive: true,
          roleId: adminRole.id,
          secretId: savedSecret.id,
        } as any);

        await userRepository.save(adminUser);
        this.logger.log(`✅ Created admin user: admin-${client.clientId} for ${client.name}`);
      }

      this.logger.log('✅ User seeding completed successfully!');
    } catch (error) {
      this.logger.error('❌ User seeding failed:', error);
      throw error;
    }
  }
}
