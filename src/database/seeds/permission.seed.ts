import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Logger } from '@nestjs/common';
import { Permission } from '../../module/v1/stc/permission/permission.entity';
import { Client } from '../../module/v1/stc/client/client.entity';

export default class PermissionSeeder implements Seeder {
  private readonly logger = new Logger(PermissionSeeder.name);

  public async run(dataSource: DataSource): Promise<void> {
    try {
      const permissionRepository = dataSource.getRepository(Permission);
      const clientRepository = dataSource.getRepository(Client);

      // Get all clients
      const clients = await clientRepository.find();
      if (clients.length === 0) {
        this.logger.log('⚠️  No clients found, skipping permission seeding');
        return;
      }

      // Check if permissions already exist
      const existingPermissionsCount = await permissionRepository.count();
      if (existingPermissionsCount > 0) {
        this.logger.log('✅ Permissions already exist, skipping permission seeding');
        return;
      }

      const basePermissions = [
        // User management permissions
        { resource: 'users', action: 'create', description: 'Can create new users' },
        { resource: 'users', action: 'read', description: 'Can view user details' },
        { resource: 'users', action: 'update', description: 'Can update user information' },
        { resource: 'users', action: 'delete', description: 'Can delete users' },
        { resource: 'users', action: 'list', description: 'Can list all users' },

        // Role management permissions
        { resource: 'roles', action: 'create', description: 'Can create new roles' },
        { resource: 'roles', action: 'read', description: 'Can view role details' },
        { resource: 'roles', action: 'update', description: 'Can update role information' },
        { resource: 'roles', action: 'delete', description: 'Can delete roles' },
        { resource: 'roles', action: 'list', description: 'Can list all roles' },

        // Permission management permissions
        { resource: 'permissions', action: 'create', description: 'Can create new permissions' },
        { resource: 'permissions', action: 'read', description: 'Can view permission details' },
        { resource: 'permissions', action: 'update', description: 'Can update permission information' },
        { resource: 'permissions', action: 'delete', description: 'Can delete permissions' },
        { resource: 'permissions', action: 'list', description: 'Can list all permissions' },

        // Menu management permissions
        { resource: 'menus', action: 'create', description: 'Can create new menus' },
        { resource: 'menus', action: 'read', description: 'Can view menu details' },
        { resource: 'menus', action: 'update', description: 'Can update menu information' },
        { resource: 'menus', action: 'delete', description: 'Can delete menus' },
        { resource: 'menus', action: 'list', description: 'Can list all menus' },
      ];

      // Create permissions for each client
      for (const client of clients) {
        this.logger.log(`🔄 Creating permissions for client: ${client.name}`);
        
        for (const permissionData of basePermissions) {
          const existingPermission = await permissionRepository.findOne({
            where: { 
              clientId: client.id,
              resource: permissionData.resource,
              action: permissionData.action 
            },
          });

          if (!existingPermission) {
            const permission = permissionRepository.create({
              clientId: client.id,
              ...permissionData,
            });
            await permissionRepository.save(permission);
            this.logger.log(`✅ Created permission: ${permissionData.resource}:${permissionData.action} for ${client.name}`);
          } else {
            this.logger.log(`ℹ️  Permission already exists: ${permissionData.resource}:${permissionData.action} for ${client.name}`);
          }
        }
      }

      this.logger.log('✅ Permission seeding completed successfully!');
    } catch (error) {
      this.logger.error('❌ Permission seeding failed:', error);
      throw error;
    }
  }
} 