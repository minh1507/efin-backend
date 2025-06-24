import 'reflect-metadata';
import ServerInitializer from './server/init.server';

/**
 * Application entry point
 * Initializes and starts the EFIN Backend server
 */
async function bootstrap(): Promise<void> {
  const server = new ServerInitializer();
  await server.run();
}

// Start the application
bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
