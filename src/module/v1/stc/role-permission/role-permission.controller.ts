import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RolePermissionService } from './role-permission.service';
import { AssignPermissionsToRoleDto, RemovePermissionsFromRoleDto } from './role-permission.dto';
import { SimpleJwtGuard } from '../../guard/simple-jwt.guard';
import SysHelper from 'src/util/sys.util';

@ApiTags('Role Permissions')
@Controller(SysHelper.getPath(__dirname, 'role-permissions'))
@UseGuards(SimpleJwtGuard)
export class RolePermissionController {
  constructor(private readonly rolePermissionService: RolePermissionService) {}

  @Post('roles/:roleId/assign')
  @ApiOperation({ summary: 'Assign permissions to a role' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Permissions assigned successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Role or permissions not found' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Permissions already assigned' })
  async assignPermissionsToRole(
    @Param('roleId') roleId: string,
    @Body() assignPermissionsDto: AssignPermissionsToRoleDto
  ) {
    await this.rolePermissionService.assignPermissionsToRole(roleId, assignPermissionsDto);
    return {
      message: 'Permissions assigned to role successfully',
    };
  }

  @Delete('roles/:roleId/remove')
  @ApiOperation({ summary: 'Remove permissions from a role' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Permissions removed successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Role or permission assignments not found' })
  async removePermissionsFromRole(
    @Param('roleId') roleId: string,
    @Body() removePermissionsDto: RemovePermissionsFromRoleDto
  ) {
    await this.rolePermissionService.removePermissionsFromRole(roleId, removePermissionsDto);
    return {
      message: 'Permissions removed from role successfully',
    };
  }

  @Get('roles/:roleId/permissions')
  @ApiOperation({ summary: 'Get all permissions for a role' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Role permissions retrieved successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Role not found' })
  async getRolePermissions(@Param('roleId') roleId: string) {
    const permissions = await this.rolePermissionService.getRolePermissions(roleId);
    return {
      message: 'Role permissions retrieved successfully',
      data: permissions,
    };
  }

  @Get('permissions/:permissionId/roles')
  @ApiOperation({ summary: 'Get all roles that have a permission' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Permission roles retrieved successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Permission not found' })
  async getPermissionRoles(@Param('permissionId') permissionId: string) {
    const roles = await this.rolePermissionService.getPermissionRoles(permissionId);
    return {
      message: 'Permission roles retrieved successfully',
      data: roles,
    };
  }

  @Get('clients/:clientId/overview')
  @ApiOperation({ summary: 'Get role-permission overview for a client' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Role-permission overview retrieved successfully' })
  async getRolePermissionsByClient(@Param('clientId') clientId: string) {
    const overview = await this.rolePermissionService.getRolePermissionsByClient(clientId);
    return {
      message: 'Role-permission overview retrieved successfully',
      data: overview,
    };
  }

  @Get('roles/:roleId/permissions/:permissionId/check')
  @ApiOperation({ summary: 'Check if a role has a specific permission' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Permission check completed' })
  async checkRoleHasPermission(
    @Param('roleId') roleId: string,
    @Param('permissionId') permissionId: string
  ) {
    const hasPermission = await this.rolePermissionService.checkRoleHasPermission(roleId, permissionId);
    return {
      message: 'Permission check completed',
      data: { hasPermission },
    };
  }

  @Get('roles/:roleId/check/:resource/:action')
  @ApiOperation({ summary: 'Check if a role has permission for a resource action' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Permission check completed' })
  async checkRoleHasPermissionByAction(
    @Param('roleId') roleId: string,
    @Param('resource') resource: string,
    @Param('action') action: string
  ) {
    const hasPermission = await this.rolePermissionService.checkRoleHasPermissionByAction(
      roleId,
      resource,
      action
    );
    return {
      message: 'Permission check completed',
      data: { hasPermission, resource, action },
    };
  }
} 