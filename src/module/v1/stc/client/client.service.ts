import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Client } from './client.entity';
import { CreateClientDto, UpdateClientDto } from './client.dto';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async create(createClientDto: CreateClientDto): Promise<Client> {
    // Check if clientId already exists
    const existingClient = await this.clientRepository.findOne({
      where: { clientId: createClientDto.clientId },
    });

    if (existingClient) {
      throw new ConflictException('Client ID already exists');
    }

    // Hash client secret if provided
    const clientData: any = { ...createClientDto };
    if (createClientDto.clientSecret) {
      clientData.clientSecret = await bcrypt.hash(createClientDto.clientSecret, 12);
    }

    // Generate JWT secret if not provided and JWT is in supported auth types
    if (
      createClientDto.supportedAuthTypes?.includes('JWT') &&
      !clientData.jwtSecret
    ) {
      clientData.jwtSecret = this.generateJwtSecret();
    }

    const client = this.clientRepository.create(clientData);
    const savedClient = await this.clientRepository.save(client);
    return Array.isArray(savedClient) ? savedClient[0] : savedClient;
  }

  async findAll(): Promise<Client[]> {
    return await this.clientRepository.find({
      where: { isActive: true },
    });
  }

  async findOne(id: string): Promise<Client> {
    const client = await this.clientRepository.findOne({
      where: { id },
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    return client;
  }

  async findByClientId(clientId: string): Promise<Client> {
    const client = await this.clientRepository.findOne({
      where: { clientId, isActive: true },
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    return client;
  }

  async update(id: string, updateClientDto: UpdateClientDto): Promise<Client> {
    const client = await this.findOne(id);

    // Hash client secret if provided
    const updateData: any = { ...updateClientDto };
    if (updateClientDto.clientSecret) {
      updateData.clientSecret = await bcrypt.hash(updateClientDto.clientSecret, 12);
    }

    // Generate JWT secret if not provided and JWT is in supported auth types
    if (
      updateClientDto.supportedAuthTypes?.includes('JWT') &&
      !client.jwtSecret
    ) {
      updateData.jwtSecret = this.generateJwtSecret();
    }

    Object.assign(client, updateData);
    return await this.clientRepository.save(client);
  }

  async remove(id: string): Promise<void> {
    const client = await this.findOne(id);
    client.isActive = false;
    await this.clientRepository.save(client);
  }

  async validateClientCredentials(clientId: string, clientSecret: string): Promise<Client | null> {
    const client = await this.clientRepository.findOne({
      where: { clientId, isActive: true },
    });

    if (!client || !client.clientSecret) {
      return null;
    }

    const isValidSecret = await bcrypt.compare(clientSecret, client.clientSecret);
    return isValidSecret ? client : null;
  }

  private generateJwtSecret(): string {
    return require('crypto').randomBytes(64).toString('hex');
  }
} 