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
import { PermissionService } from './permission.service';
import { CreatePermissionDto, UpdatePermissionDto } from './permission.dto';
import { SimpleJwtGuard } from '../../guard/simple-jwt.guard';
import SysHelper from 'src/util/sys.util';

@ApiTags('Permissions')
@Controller(SysHelper.getPath(__dirname))
@UseGuards(SimpleJwtGuard)
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new permission' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Permission created successfully' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Permission already exists' })
  async create(@Body() createPermissionDto: CreatePermissionDto) {
    const permission = await this.permissionService.create(createPermissionDto);
    return {
      message: 'Permission created successfully',
      data: permission,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all permissions' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Permissions retrieved successfully' })
  @ApiQuery({ name: 'resource', required: false, description: 'Filter by resource' })
  @ApiQuery({ name: 'clientId', required: false, description: 'Filter by client' })
  async findAll(@Query('resource') resource?: string, @Query('clientId') clientId?: string) {
    const permissions = resource 
      ? await this.permissionService.findByResource(resource, clientId)
      : await this.permissionService.findAll(clientId);
    return {
      message: 'Permissions retrieved successfully',
      data: permissions,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get permission by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Permission retrieved successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Permission not found' })
  async findOne(@Param('id') id: string) {
    const permission = await this.permissionService.findOne(id);
    return {
      message: 'Permission retrieved successfully',
      data: permission,
    };
  }

  @Get('check/:clientId/:resource/:action')
  @ApiOperation({ summary: 'Check if permission exists for resource and action' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Permission check result' })
  async checkPermission(
    @Param('clientId') clientId: string,
    @Param('resource') resource: string,
    @Param('action') action: string,
  ) {
    const permission = await this.permissionService.checkPermission(resource, action, clientId);
    return {
      message: 'Permission check completed',
      data: {
        exists: !!permission,
        permission: permission || null,
      },
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update permission' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Permission updated successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Permission not found' })
  async update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    const permission = await this.permissionService.update(id, updatePermissionDto);
    return {
      message: 'Permission updated successfully',
      data: permission,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete permission' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Permission deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Permission not found' })
  async remove(@Param('id') id: string) {
    await this.permissionService.remove(id);
    return {
      message: 'Permission deleted successfully',
    };
  }
} 