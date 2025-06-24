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
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto, ChangePasswordDto } from './user.dto';
import { SimpleJwtGuard } from '../../../guard/simple-jwt.guard';
import SysHelper from 'src/util/sys.util';

@ApiTags('Users')
@Controller(SysHelper.getPath(__dirname, 'users'))
@UseGuards(SimpleJwtGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'User created successfully' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Username or email already exists' })
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    return {
      message: 'User created successfully',
      data: user,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Users retrieved successfully' })
  @ApiQuery({ name: 'clientId', required: false, description: 'Filter by client' })
  async findAll(@Query('clientId') clientId?: string) {
    const users = await this.userService.findAll(clientId);
    return {
      message: 'Users retrieved successfully',
      data: users,
    };
  }

  @Get('stats/:clientId')
  @ApiOperation({ summary: 'Get user statistics for a client' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User statistics retrieved successfully' })
  async getStats(@Param('clientId') clientId: string) {
    const stats = await this.userService.getStatsByClient(clientId);
    return {
      message: 'User statistics retrieved successfully',
      data: stats,
    };
  }

  @Get('client/:clientId')
  @ApiOperation({ summary: 'Get users by client' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Client users retrieved successfully' })
  async findByClient(@Param('clientId') clientId: string) {
    const users = await this.userService.findByClient(clientId);
    return {
      message: 'Client users retrieved successfully',
      data: users,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User retrieved successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(id);
    return {
      message: 'User retrieved successfully',
      data: user,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User updated successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.userService.update(id, updateUserDto);
    return {
      message: 'User updated successfully',
      data: user,
    };
  }

  @Post(':id/change-password')
  @ApiOperation({ summary: 'Change user password' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Password changed successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Current password is incorrect' })
  async changePassword(@Param('id') id: string, @Body() changePasswordDto: ChangePasswordDto) {
    await this.userService.changePassword(id, changePasswordDto);
    return {
      message: 'Password changed successfully',
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  async remove(@Param('id') id: string) {
    await this.userService.remove(id);
    return {
      message: 'User deleted successfully',
    };
  }
} 