import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ClientService } from './client.service';
import { CreateClientDto, UpdateClientDto } from './client.dto';
import { SimpleJwtGuard } from '../../guard/simple-jwt.guard';
import SysHelper from 'src/util/sys.util';
// SuccessResponse removed, using standard response format

@ApiTags('Clients')
@ApiBearerAuth()
@UseGuards(SimpleJwtGuard)
@Controller(SysHelper.getPath(__dirname))
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new client' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Client created successfully' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Client ID already exists' })
  async create(@Body() createClientDto: CreateClientDto) {
    const client = await this.clientService.create(createClientDto);
    return {
      message: 'Client created successfully',
      data: client,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all clients' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Clients retrieved successfully' })
  async findAll() {
    const clients = await this.clientService.findAll();
    return {
      message: 'Clients retrieved successfully',
      data: clients,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get client by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Client retrieved successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Client not found' })
  async findOne(@Param('id') id: string) {
    const client = await this.clientService.findOne(id);
    return {
      message: 'Client retrieved successfully',
      data: client,
    };
  }

  @Get('by-client-id/:clientId')
  @ApiOperation({ summary: 'Get client by client ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Client retrieved successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Client not found' })
  async findByClientId(@Param('clientId') clientId: string) {
    const client = await this.clientService.findByClientId(clientId);
    return {
      message: 'Client retrieved successfully',
      data: client,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update client' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Client updated successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Client not found' })
  async update(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    const client = await this.clientService.update(id, updateClientDto);
    return {
      message: 'Client updated successfully',
      data: client,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete client (soft delete)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Client deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Client not found' })
  async remove(@Param('id') id: string) {
    await this.clientService.remove(id);
    return {
      message: 'Client deleted successfully',
    };
  }
} 