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
        { code: 'USER_CREATE', name: 'Create Users', resource: 'users', action: 'create', description: 'Can create new users' },
        { code: 'USER_READ', name: 'Read Users', resource: 'users', action: 'read', description: 'Can view user details' },
        { code: 'USER_UPDATE', name: 'Update Users', resource: 'users', action: 'update', description: 'Can update user information' },
        { code: 'USER_DELETE', name: 'Delete Users', resource: 'users', action: 'delete', description: 'Can delete users' },
        { code: 'USER_LIST', name: 'List Users', resource: 'users', action: 'list', description: 'Can list all users' },

        // Role management permissions
        { code: 'ROLE_CREATE', name: 'Create Roles', resource: 'roles', action: 'create', description: 'Can create new roles' },
        { code: 'ROLE_READ', name: 'Read Roles', resource: 'roles', action: 'read', description: 'Can view role details' },
        { code: 'ROLE_UPDATE', name: 'Update Roles', resource: 'roles', action: 'update', description: 'Can update role information' },
        { code: 'ROLE_DELETE', name: 'Delete Roles', resource: 'roles', action: 'delete', description: 'Can delete roles' },
        { code: 'ROLE_LIST', name: 'List Roles', resource: 'roles', action: 'list', description: 'Can list all roles' },

        // Permission management permissions
        { code: 'PERM_CREATE', name: 'Create Permissions', resource: 'permissions', action: 'create', description: 'Can create new permissions' },
        { code: 'PERM_READ', name: 'Read Permissions', resource: 'permissions', action: 'read', description: 'Can view permission details' },
        { code: 'PERM_UPDATE', name: 'Update Permissions', resource: 'permissions', action: 'update', description: 'Can update permission information' },
        { code: 'PERM_DELETE', name: 'Delete Permissions', resource: 'permissions', action: 'delete', description: 'Can delete permissions' },
        { code: 'PERM_LIST', name: 'List Permissions', resource: 'permissions', action: 'list', description: 'Can list all permissions' },

        // Menu management permissions
        { code: 'MENU_CREATE', name: 'Create Menus', resource: 'menus', action: 'create', description: 'Can create new menus' },
        { code: 'MENU_READ', name: 'Read Menus', resource: 'menus', action: 'read', description: 'Can view menu details' },
        { code: 'MENU_UPDATE', name: 'Update Menus', resource: 'menus', action: 'update', description: 'Can update menu information' },
        { code: 'MENU_DELETE', name: 'Delete Menus', resource: 'menus', action: 'delete', description: 'Can delete menus' },
        { code: 'MENU_LIST', name: 'List Menus', resource: 'menus', action: 'list', description: 'Can list all menus' },
      ];

      // Create permissions for each client
      for (const client of clients) {
        this.logger.log(`🔄 Creating permissions for client: ${client.name}`);
        
        for (const permissionData of basePermissions) {
          // Create unique code per client (keep it under 25 chars)
          const clientPrefix = client.clientId.split('-')[0].toUpperCase(); // auth, mobile, web
          const uniqueCode = `${clientPrefix}_${permissionData.code}`;
          
          const existingPermission = await permissionRepository.findOne({
            where: { 
              clientId: client.id,
              code: uniqueCode
            },
          });

          if (!existingPermission) {
            const permission = permissionRepository.create({
              clientId: client.id,
              code: uniqueCode,
              name: permissionData.name,
              resource: permissionData.resource,
              action: permissionData.action,
              description: permissionData.description,
            });
            await permissionRepository.save(permission);
            this.logger.log(`✅ Created permission: ${uniqueCode} (${permissionData.resource}:${permissionData.action}) for ${client.name}`);
          } else {
            this.logger.log(`ℹ️  Permission already exists: ${uniqueCode} for ${client.name}`);
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