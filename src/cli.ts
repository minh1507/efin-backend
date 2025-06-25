#!/usr/bin/env node

import { exportSimpleApiDocumentation } from './command/export-doc.command';
import { runDatabaseSeeding } from './command/seeding.command';
import consola from 'consola';

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  try {
    switch (command) {
      case 'export-doc':
        await exportSimpleApiDocumentation();
        break;
      
      case 'seed':
        await runDatabaseSeeding();
        break;
      
      default:
        consola.info('Available commands:');
        consola.info('  export-doc  - Export API documentation to AsciiDoc format');
        consola.info('  seed        - Run database seeding');
        break;
    }
  } catch (error) {
    consola.error('Command failed:', error);
    process.exit(1);
  }
}

main(); 