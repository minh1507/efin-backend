import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './permission.entity';
import { CreatePermissionDto, UpdatePermissionDto } from './permission.dto';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    // Check if resource + action combination already exists for this client
    const existingResourceAction = await this.permissionRepository.findOne({
      where: { 
        clientId: createPermissionDto.clientId,
        resource: createPermissionDto.resource,
        action: createPermissionDto.action 
      },
    });

    if (existingResourceAction) {
      throw new ConflictException('Permission for this resource and action already exists for this client');
    }

    const permission = this.permissionRepository.create(createPermissionDto);
    return await this.permissionRepository.save(permission);
  }

  async findAll(clientId?: string): Promise<Permission[]> {
    const whereCondition = clientId ? { clientId } : {};
    return await this.permissionRepository.find({
      where: whereCondition,
      order: { resource: 'ASC', action: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Permission> {
    const permission = await this.permissionRepository.findOne({
      where: { id },
    });

    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    return permission;
  }

  async findByResource(resource: string, clientId?: string): Promise<Permission[]> {
    const whereCondition = clientId ? { resource, clientId } : { resource };
    return await this.permissionRepository.find({
      where: whereCondition,
      order: { action: 'ASC' },
    });
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto): Promise<Permission> {
    const permission = await this.findOne(id);

    // Check if resource + action combination already exists (excluding current permission)
    if (updatePermissionDto.resource || updatePermissionDto.action) {
      const resource = updatePermissionDto.resource || permission.resource;
      const action = updatePermissionDto.action || permission.action;
      
      const existingResourceAction = await this.permissionRepository.findOne({
        where: { 
          resource,
          action,
          id: { $ne: id } as any
        },
      });

      if (existingResourceAction) {
        throw new ConflictException('Permission for this resource and action already exists');
      }
    }

    Object.assign(permission, updatePermissionDto);
    return await this.permissionRepository.save(permission);
  }

  async remove(id: string): Promise<void> {
    const permission = await this.findOne(id);
    await this.permissionRepository.remove(permission);
  }

  async checkPermission(resource: string, action: string, clientId: string): Promise<Permission | null> {
    return await this.permissionRepository.findOne({
      where: { resource, action, clientId },
    });
  }
} 