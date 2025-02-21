import { exec } from 'child_process';
import consola from 'consola';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function generateMigrations(): Promise<void> {
  try {
    const checkCommand = `npm run typeorm -- schema:log`;
    consola.start(`Checking for schema changes with command: ${checkCommand}`);

    const { stdout: schemaLogOutput, stderr: schemaLogError } =
      await execAsync(checkCommand);

    if (schemaLogError) throw new Error(schemaLogError);

    if (schemaLogOutput.includes('up to date')) {
      consola.info(
        'No schema changes detected. Skipping migration generation.',
      );
      return;
    }

    const generateCommand = `npm run typeorm -- migration:generate src/database/migrations/auto`;
    consola.start(
      `Schema changes detected. Running migration generation command: ${generateCommand}`,
    );

    const { stdout, stderr } = await execAsync(generateCommand);

    if (stderr) throw new Error(stderr);

    consola.success(`Migration generated successfully:\n${stdout}`);
  } catch (error) {
    consola.error('Error generating migrations:', error);
  }
}

export async function runMigrations(): Promise<void> {
  try {
    const command = `npm run typeorm migration:run`;

    consola.start(`Running migration run command: ${command}`);

    const { stdout, stderr } = await execAsync(command);

    if (stderr) throw new Error(stderr);

    consola.success(`Migration run successfully:\n${stdout}`);
  } catch (error) {
    consola.error('Error run migrations:', error);
  }
}

export async function runSeed(): Promise<void> {
  try {
    const command = `npm run seed`;

    consola.start(`Running seed command: ${command}`);

    const { stdout, stderr } = await execAsync(command);

    if (stderr) throw new Error(stderr);

    consola.success(`Seed run successfully:\n${stdout}`);
  } catch (error) {
    consola.error('Error run seeds:', error);
  }
}
