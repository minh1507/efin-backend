import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Logger } from '@nestjs/common';
import { Role } from '../../module/v1/stc/category/role/role.entity';
import { Client } from '../../module/v1/stc/client/client.entity';

export default class RoleSeeder implements Seeder {
  private readonly logger = new Logger(RoleSeeder.name);

  public async run(dataSource: DataSource): Promise<void> {
    try {
      const roleRepository = dataSource.getRepository(Role);
      const clientRepository = dataSource.getRepository(Client);

      // Get all clients
      const clients = await clientRepository.find();
      if (clients.length === 0) {
        this.logger.log('⚠️  No clients found, skipping role seeding');
        return;
      }

      // Check if roles already exist
      const existingRolesCount = await roleRepository.count();
      if (existingRolesCount > 0) {
        this.logger.log('✅ Roles already exist, skipping role seeding');
        return;
      }

      const baseRoles = [
        {
          code: 'ADMIN',
          name: 'Administrator',
          description: 'Full system access',
        },
        {
          code: 'MANAGER',
          name: 'Manager', 
          description: 'Can manage users and configurations',
        },
        {
          code: 'USER',
          name: 'User',
          description: 'Regular user access',
        },
      ];

      // Create roles for each client
      for (const client of clients) {
        this.logger.log(`🔄 Creating roles for client: ${client.name}`);
        
        for (const roleData of baseRoles) {
          const existingRole = await roleRepository.findOne({
            where: { 
              clientId: client.id,
              code: roleData.code 
            },
          });

          if (!existingRole) {
            const role = roleRepository.create({
              clientId: client.id,
              ...roleData,
            });
            await roleRepository.save(role);
            this.logger.log(`✅ Created role: ${roleData.name} for ${client.name}`);
          } else {
            this.logger.log(`ℹ️  Role already exists: ${roleData.name} for ${client.name}`);
          }
        }
      }

      this.logger.log('✅ Role seeding completed successfully!');
    } catch (error) {
      this.logger.error('❌ Role seeding failed:', error);
      throw error;
    }
  }
}

