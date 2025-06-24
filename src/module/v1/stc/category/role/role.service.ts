import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';
import { CreateRoleDto, UpdateRoleDto } from './role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    // Check if role code already exists for this client
    const existingRole = await this.roleRepository.findOne({
      where: { 
        clientId: createRoleDto.clientId,
        code: createRoleDto.code 
      },
    });

    if (existingRole) {
      throw new ConflictException('Role code already exists for this client');
    }

    const role = this.roleRepository.create(createRoleDto);
    return await this.roleRepository.save(role);
  }

  async findAll(clientId?: string): Promise<Role[]> {
    const whereCondition = clientId ? { clientId } : {};
    return await this.roleRepository.find({
      where: whereCondition,
      order: { code: 'ASC' },
      relations: ['client'],
    });
  }

  async findOne(id: string): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['client', 'users'],
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return role;
  }

  async findByClient(clientId: string): Promise<Role[]> {
    return await this.roleRepository.find({
      where: { clientId },
      order: { code: 'ASC' },
    });
  }

  async findByCode(code: string, clientId: string): Promise<Role | null> {
    return await this.roleRepository.findOne({
      where: { code, clientId },
    });
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOne(id);

    Object.assign(role, updateRoleDto);
    return await this.roleRepository.save(role);
  }

  async remove(id: string): Promise<void> {
    const role = await this.findOne(id);
    
    // Check if role has users
    if (role.users && role.users.length > 0) {
      throw new ConflictException('Cannot delete role with assigned users');
    }

    await this.roleRepository.remove(role);
  }

  async getStatsByClient(clientId: string): Promise<any> {
    const [total, active] = await Promise.all([
      this.roleRepository.count({ where: { clientId } }),
      this.roleRepository.count({ where: { clientId, isActive: true } }),
    ]);

    return {
      total,
      active,
      inactive: total - active,
    };
  }
} 