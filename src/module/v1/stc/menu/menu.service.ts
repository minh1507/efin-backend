import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Menu } from './menu.entity';
import { CreateMenuDto, UpdateMenuDto } from './menu.dto';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
  ) {}

  async create(createMenuDto: CreateMenuDto): Promise<Menu> {
    // Check if menu path already exists for this client
    const existingMenu = await this.menuRepository.findOne({
      where: { 
        clientId: createMenuDto.clientId,
        path: createMenuDto.path 
      },
    });

    if (existingMenu) {
      throw new ConflictException('Menu path already exists for this client');
    }

    const menu = this.menuRepository.create({
      ...createMenuDto,
      sortOrder: createMenuDto.sortOrder || 0,
      isVisible: createMenuDto.isVisible !== false,
    });
    return await this.menuRepository.save(menu);
  }

  async findAll(clientId?: string): Promise<Menu[]> {
    const whereCondition = clientId ? { clientId } : {};
    return await this.menuRepository.find({
      where: whereCondition,
      order: { sortOrder: 'ASC', name: 'ASC' },
      relations: ['client'],
    });
  }

  async findOne(id: string): Promise<Menu> {
    const menu = await this.menuRepository.findOne({
      where: { id },
      relations: ['client'],
    });

    if (!menu) {
      throw new NotFoundException('Menu not found');
    }

    return menu;
  }

  async findByClient(clientId: string): Promise<Menu[]> {
    return await this.menuRepository.find({
      where: { clientId },
      order: { sortOrder: 'ASC', name: 'ASC' },
    });
  }

  async findVisibleByClient(clientId: string): Promise<Menu[]> {
    return await this.menuRepository.find({
      where: { clientId, isVisible: true },
      order: { sortOrder: 'ASC', name: 'ASC' },
    });
  }

  async update(id: string, updateMenuDto: UpdateMenuDto): Promise<Menu> {
    const menu = await this.findOne(id);

    // Check if new path conflicts with existing menus (if path is being updated)
    if (updateMenuDto.path && updateMenuDto.path !== menu.path) {
      const existingMenu = await this.menuRepository.findOne({
        where: { 
          clientId: menu.clientId,
          path: updateMenuDto.path,
        },
      });

      if (existingMenu && existingMenu.id !== id) {
        throw new ConflictException('Menu path already exists for this client');
      }
    }

    Object.assign(menu, updateMenuDto);
    return await this.menuRepository.save(menu);
  }

  async remove(id: string): Promise<void> {
    const menu = await this.findOne(id);
    await this.menuRepository.remove(menu);
  }

  async getStatsByClient(clientId: string): Promise<any> {
    const [total, visible] = await Promise.all([
      this.menuRepository.count({ where: { clientId } }),
      this.menuRepository.count({ where: { clientId, isVisible: true } }),
    ]);

    return {
      total,
      visible,
      hidden: total - visible,
    };
  }

  async updateSortOrder(clientId: string, menuOrders: { id: string; sortOrder: number }[]): Promise<void> {
    // Validate all menus belong to the client
    for (const item of menuOrders) {
      const menu = await this.menuRepository.findOne({
        where: { id: item.id, clientId },
      });

      if (!menu) {
        throw new NotFoundException(`Menu ${item.id} not found for this client`);
      }
    }

    // Update sort orders
    for (const item of menuOrders) {
      await this.menuRepository.update(item.id, { sortOrder: item.sortOrder });
    }
  }
} 