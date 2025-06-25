import { runSeeders } from 'typeorm-extension';
import { AppDataSource } from '../config/data-source.config';
import MainSeeder from '../database/seeds/main.seed';
import consola from 'consola';

export async function runDatabaseSeeding(): Promise<void> {
  try {
    consola.start('🌱 Starting database seeding...');
    
    // Initialize data source if not already
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      consola.success('✅ Database connection initialized');
    }

    // Run main seeder
    await runSeeders(AppDataSource, {
      seeds: [MainSeeder],
    });

    consola.success('✅ Database seeding completed successfully!');
    
    // Close connection
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
    
  } catch (error) {
    consola.error('❌ Database seeding failed:', error);
    throw error;
  }
} 