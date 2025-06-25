#!/usr/bin/env node

import { exportSimpleApiDocumentation } from './command/export-doc.command';
import consola from 'consola';

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  try {
    switch (command) {
      case 'export-doc':
        await exportSimpleApiDocumentation();
        break;
      
      default:
        consola.info('Available commands:');
        consola.info('  export-doc  - Export API documentation to AsciiDoc format');
        break;
    }
  } catch (error) {
    consola.error('Command failed:', error);
    process.exit(1);
  }
}

main(); 