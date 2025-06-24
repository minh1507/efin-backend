import { Injectable, NotFoundException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { Secret } from '../secret/secret.entity';
import { Role } from '../role/role.entity';
import { CreateUserDto, UpdateUserDto, ChangePasswordDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Secret)
    private readonly secretRepository: Repository<Secret>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if username already exists for this client
    const existingUser = await this.userRepository.findOne({
      where: { 
        clientId: createUserDto.clientId,
        username: createUserDto.username 
      },
    });

    if (existingUser) {
      throw new ConflictException('Username already exists for this client');
    }

    // Check if email already exists for this client (if provided)
    if (createUserDto.email) {
      const existingEmail = await this.userRepository.findOne({
        where: { 
          clientId: createUserDto.clientId,
          email: createUserDto.email 
        },
      });

      if (existingEmail) {
        throw new ConflictException('Email already exists for this client');
      }
    }

    // Validate role belongs to the same client
    const role = await this.roleRepository.findOne({
      where: { 
        id: createUserDto.roleId,
        clientId: createUserDto.clientId 
      },
    });

    if (!role) {
      throw new NotFoundException('Role not found for this client');
    }

    // Create secret (password)
    const hashedPassword = await bcrypt.hash(createUserDto.password, 12);
    const secret = this.secretRepository.create({
      password: hashedPassword,
    });
    const savedSecret = await this.secretRepository.save(secret);

    // Create user
    const user = this.userRepository.create({
      clientId: createUserDto.clientId,
      roleId: createUserDto.roleId,
      username: createUserDto.username,
      email: createUserDto.email,
      fullName: createUserDto.fullName,
      isActive: createUserDto.isActive !== false,
      secretId: savedSecret.id,
    });

    return await this.userRepository.save(user);
  }

  async findAll(clientId?: string): Promise<User[]> {
    const whereCondition = clientId ? { clientId } : {};
    return await this.userRepository.find({
      where: whereCondition,
      order: { username: 'ASC' },
      relations: ['client', 'role'],
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['client', 'role'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByClient(clientId: string): Promise<User[]> {
    return await this.userRepository.find({
      where: { clientId },
      order: { username: 'ASC' },
      relations: ['role'],
    });
  }

  async changePassword(id: string, changePasswordDto: ChangePasswordDto): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['secret'],
    });

    if (!user || !user.secret) {
      throw new NotFoundException('User or password not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.secret.password
    );

    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(changePasswordDto.newPassword, 12);

    // Update password
    user.secret.password = hashedNewPassword;
    await this.secretRepository.save(user.secret);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    // If updating role, validate it belongs to the same client
    if (updateUserDto.roleId) {
      const role = await this.roleRepository.findOne({
        where: { 
          id: updateUserDto.roleId,
          clientId: user.clientId 
        },
      });

      if (!role) {
        throw new NotFoundException('Role not found for this client');
      }
    }

    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    
    // Also remove the secret
    if (user.secret) {
      await this.secretRepository.remove(user.secret);
    }

    await this.userRepository.remove(user);
  }

  async getStatsByClient(clientId: string): Promise<any> {
    const [total, active] = await Promise.all([
      this.userRepository.count({ where: { clientId } }),
      this.userRepository.count({ where: { clientId, isActive: true } }),
    ]);

    return {
      total,
      active,
      inactive: total - active,
    };
  }
} 