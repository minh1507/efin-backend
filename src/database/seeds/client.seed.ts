import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Client } from '../../module/v1/stc/client/client.entity';

export default class ClientSeeder implements Seeder {
  private readonly logger = new Logger(ClientSeeder.name);

  public async run(dataSource: DataSource): Promise<void> {
    try {
      const clientRepository = dataSource.getRepository(Client);

      // Check if clients already exist
      const existingClientsCount = await clientRepository.count();
      if (existingClientsCount > 0) {
        this.logger.log('✅ Clients already exist, skipping client seeding');
        return;
      }

      const clients = [
        {
          clientId: 'auth-server-admin',
          name: 'Auth Server Admin Panel',
          clientSecret: await bcrypt.hash('AdminPanel123!', 12),
          description: 'Admin panel for managing authentication server',
          isActive: true,
          authorizationType: 'RBAC',
          supportedAuthTypes: ['JWT', 'BASIC'],
          jwtSecret: this.generateJwtSecret(),
          jwtExpiresIn: 3600,
        },
        {
          clientId: 'mobile-app',
          name: 'Mobile Application',
          clientSecret: await bcrypt.hash('MobileApp123!', 12),
          description: 'Mobile application client',
          isActive: true,
          authorizationType: 'RBAC',
          supportedAuthTypes: ['JWT', 'OAUTH2'],
          jwtSecret: this.generateJwtSecret(),
          jwtExpiresIn: 7200,
          oauth2RedirectUris: ['com.yourapp://callback'],
          oauth2Scopes: ['read', 'write'],
        },
        {
          clientId: 'web-app',
          name: 'Web Application',
          clientSecret: await bcrypt.hash('WebApp123!', 12),
          description: 'Web application client',
          isActive: true,
          authorizationType: 'RBAC',
          supportedAuthTypes: ['JWT', 'BASIC', 'OAUTH2'],
          jwtSecret: this.generateJwtSecret(),
          jwtExpiresIn: 1800,
          oauth2RedirectUris: ['http://localhost:3000/callback', 'https://yourapp.com/callback'],
          oauth2Scopes: ['read', 'write', 'admin'],
        },
      ];

      for (const clientData of clients) {
        const existingClient = await clientRepository.findOne({
          where: { clientId: clientData.clientId },
        });

        if (!existingClient) {
          const client = clientRepository.create(clientData);
          await clientRepository.save(client);
          this.logger.log(`✅ Created client: ${clientData.name}`);
        } else {
          this.logger.log(`ℹ️  Client already exists: ${clientData.name}`);
        }
      }

      this.logger.log('✅ Client seeding completed successfully!');
    } catch (error) {
      this.logger.error('❌ Client seeding failed:', error);
      throw error;
    }
  }

  private generateJwtSecret(): string {
    return require('crypto').randomBytes(64).toString('hex');
  }
} 