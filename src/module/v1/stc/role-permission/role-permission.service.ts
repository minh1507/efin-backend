import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolePermission } from './role-permission.entity';
import { Role } from '../category/role/role.entity';
import { Permission } from '../permission/permission.entity';
import { AssignPermissionsToRoleDto, RemovePermissionsFromRoleDto } from './role-permission.dto';

@Injectable()
export class RolePermissionService {
  constructor(
    @InjectRepository(RolePermission)
    private readonly rolePermissionRepository: Repository<RolePermission>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async assignPermissionsToRole(roleId: string, dto: AssignPermissionsToRoleDto): Promise<void> {
    // Validate role exists
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    // Validate all permissions exist and belong to the same client as the role
    const permissions = await this.permissionRepository.find({
      where: dto.permissionIds.map(id => ({ id, clientId: role.clientId })),
    });

    if (permissions.length !== dto.permissionIds.length) {
      throw new NotFoundException('One or more permissions not found for this client');
    }

    // Check which permissions are already assigned
    const existingAssignments = await this.rolePermissionRepository.find({
      where: { roleId },
    });

    const existingPermissionIds = existingAssignments.map(rp => rp.permissionId);

    // Only assign permissions that are not already assigned
    const newPermissionIds = dto.permissionIds.filter(
      permissionId => !existingPermissionIds.includes(permissionId)
    );

    if (newPermissionIds.length === 0) {
      throw new ConflictException('All permissions are already assigned to this role');
    }

    // Create new role-permission assignments
    const rolePermissions = newPermissionIds.map(permissionId =>
      this.rolePermissionRepository.create({
        roleId,
        permissionId,
      })
    );

    await this.rolePermissionRepository.save(rolePermissions);
  }

  async removePermissionsFromRole(roleId: string, dto: RemovePermissionsFromRoleDto): Promise<void> {
    // Validate role exists
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    // Find existing assignments
    const existingAssignments = await this.rolePermissionRepository.find({
      where: { 
        roleId,
        permissionId: { $in: dto.permissionIds } as any
      },
    });

    if (existingAssignments.length === 0) {
      throw new NotFoundException('No matching permission assignments found');
    }

    // Remove assignments
    await this.rolePermissionRepository.remove(existingAssignments);
  }

  async getRolePermissions(roleId: string): Promise<Permission[]> {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const rolePermissions = await this.rolePermissionRepository.find({
      where: { roleId },
      relations: ['permission'],
    });

    return rolePermissions.map(rp => rp.permission);
  }

  async getPermissionRoles(permissionId: string): Promise<Role[]> {
    const permission = await this.permissionRepository.findOne({
      where: { id: permissionId },
    });

    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    const rolePermissions = await this.rolePermissionRepository.find({
      where: { permissionId },
      relations: ['role'],
    });

    return rolePermissions.map(rp => rp.role);
  }

  async getRolePermissionsByClient(clientId: string): Promise<any[]> {
    // Get all roles for this client with their permissions
    const roles = await this.roleRepository.find({
      where: { clientId },
      order: { name: 'ASC' },
    });

    const result = [];
    for (const role of roles) {
      const permissions = await this.getRolePermissions(role.id);
      result.push({
        role,
        permissions,
        permissionCount: permissions.length,
      });
    }

    return result;
  }

  async checkRoleHasPermission(roleId: string, permissionId: string): Promise<boolean> {
    const assignment = await this.rolePermissionRepository.findOne({
      where: { roleId, permissionId },
    });

    return !!assignment;
  }

  async checkRoleHasPermissionByAction(roleId: string, resource: string, action: string): Promise<boolean> {
    // Get role to find client
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
    });

    if (!role) {
      return false;
    }

    // Find permission for this client, resource and action
    const permission = await this.permissionRepository.findOne({
      where: { 
        clientId: role.clientId,
        resource,
        action 
      },
    });

    if (!permission) {
      return false;
    }

    // Check if role has this permission
    return this.checkRoleHasPermission(roleId, permission.id);
  }
} 