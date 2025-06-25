import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { RoleService } from './role.service';
import { CreateRoleDto, UpdateRoleDto } from './role.dto';
import { SimpleJwtGuard } from '../../../guard/simple-jwt.guard';
import SysHelper from 'src/util/sys.util';

@ApiTags('Roles')
@Controller(SysHelper.getPath(__dirname))
@UseGuards(SimpleJwtGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Role created successfully' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Role already exists' })
  async create(@Body() createRoleDto: CreateRoleDto) {
    const role = await this.roleService.create(createRoleDto);
    return {
      message: 'Role created successfully',
      data: role,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Roles retrieved successfully' })
  @ApiQuery({ name: 'clientId', required: false, description: 'Filter by client' })
  async findAll(@Query('clientId') clientId?: string) {
    const roles = await this.roleService.findAll(clientId);
    return {
      message: 'Roles retrieved successfully',
      data: roles,
    };
  }

  @Get('stats/:clientId')
  @ApiOperation({ summary: 'Get role statistics for a client' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Role statistics retrieved successfully' })
  async getStats(@Param('clientId') clientId: string) {
    const stats = await this.roleService.getStatsByClient(clientId);
    return {
      message: 'Role statistics retrieved successfully',
      data: stats,
    };
  }

  @Get('client/:clientId')
  @ApiOperation({ summary: 'Get roles by client' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Client roles retrieved successfully' })
  async findByClient(@Param('clientId') clientId: string) {
    const roles = await this.roleService.findByClient(clientId);
    return {
      message: 'Client roles retrieved successfully',
      data: roles,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get role by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Role retrieved successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Role not found' })
  async findOne(@Param('id') id: string) {
    const role = await this.roleService.findOne(id);
    return {
      message: 'Role retrieved successfully',
      data: role,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update role' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Role updated successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Role not found' })
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    const role = await this.roleService.update(id, updateRoleDto);
    return {
      message: 'Role updated successfully',
      data: role,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete role' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Role deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Role not found' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Cannot delete role with users' })
  async remove(@Param('id') id: string) {
    await this.roleService.remove(id);
    return {
      message: 'Role deleted successfully',
    };
  }
} 