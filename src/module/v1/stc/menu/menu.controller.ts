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
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBody } from '@nestjs/swagger';
import { MenuService } from './menu.service';
import { CreateMenuDto, UpdateMenuDto } from './menu.dto';
import { SimpleJwtGuard } from '../../guard/simple-jwt.guard';
import SysHelper from 'src/util/sys.util';

@ApiTags('Menus')
@Controller(SysHelper.getPath(__dirname))
@UseGuards(SimpleJwtGuard)
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new menu' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Menu created successfully' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Menu path already exists' })
  async create(@Body() createMenuDto: CreateMenuDto) {
    const menu = await this.menuService.create(createMenuDto);
    return {
      message: 'Menu created successfully',
      data: menu,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all menus' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Menus retrieved successfully' })
  @ApiQuery({ name: 'clientId', required: false, description: 'Filter by client' })
  async findAll(@Query('clientId') clientId?: string) {
    const menus = await this.menuService.findAll(clientId);
    return {
      message: 'Menus retrieved successfully',
      data: menus,
    };
  }

  @Get('stats/:clientId')
  @ApiOperation({ summary: 'Get menu statistics for a client' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Menu statistics retrieved successfully' })
  async getStats(@Param('clientId') clientId: string) {
    const stats = await this.menuService.getStatsByClient(clientId);
    return {
      message: 'Menu statistics retrieved successfully',
      data: stats,
    };
  }

  @Get('client/:clientId')
  @ApiOperation({ summary: 'Get menus by client' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Client menus retrieved successfully' })
  async findByClient(@Param('clientId') clientId: string) {
    const menus = await this.menuService.findByClient(clientId);
    return {
      message: 'Client menus retrieved successfully',
      data: menus,
    };
  }

  @Get('client/:clientId/visible')
  @ApiOperation({ summary: 'Get visible menus by client' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Visible client menus retrieved successfully' })
  async findVisibleByClient(@Param('clientId') clientId: string) {
    const menus = await this.menuService.findVisibleByClient(clientId);
    return {
      message: 'Visible client menus retrieved successfully',
      data: menus,
    };
  }

  @Post('client/:clientId/sort-order')
  @ApiOperation({ summary: 'Update menu sort order for a client' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Menu sort order updated successfully' })
  @ApiBody({
    description: 'Array of menu ID and sort order pairs',
    type: [Object],
    examples: {
      example1: {
        value: [
          { id: 'uuid1', sortOrder: 1 },
          { id: 'uuid2', sortOrder: 2 },
        ],
      },
    },
  })
  async updateSortOrder(
    @Param('clientId') clientId: string,
    @Body() menuOrders: { id: string; sortOrder: number }[],
  ) {
    await this.menuService.updateSortOrder(clientId, menuOrders);
    return {
      message: 'Menu sort order updated successfully',
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get menu by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Menu retrieved successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Menu not found' })
  async findOne(@Param('id') id: string) {
    const menu = await this.menuService.findOne(id);
    return {
      message: 'Menu retrieved successfully',
      data: menu,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update menu' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Menu updated successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Menu not found' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Menu path already exists' })
  async update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    const menu = await this.menuService.update(id, updateMenuDto);
    return {
      message: 'Menu updated successfully',
      data: menu,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete menu' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Menu deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Menu not found' })
  async remove(@Param('id') id: string) {
    await this.menuService.remove(id);
    return {
      message: 'Menu deleted successfully',
    };
  }
} 