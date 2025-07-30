/* istanbul ignore file */
import { LoggerService } from '@ikigaians/logger';
import { ModuleManager } from '@ikigaians/mod';
import { gracefulShutdown } from '@ikigaians/web';
import dotenv from 'dotenv';

export async function startApp(mod: ModuleManager) {
  dotenv.config();

  process.on('uncaughtException', (err) => {
    mod.logger.error(`uncaughtException: ${err.stack || err.message}`);
  });
  process.on('unhandledRejection', (err: Error) => {
    mod.logger.error(`unhandledRejection: ${err.stack || err.message}`);
  });
  try {
    await mod.initialize();
    await mod.start();

    gracefulShutdown(async () => {
      await mod.dispose();
      return true;
    }, mod.logger as LoggerService);
  } catch (error) {
    const err = error as Error;
    mod.logger.error(`start app error: ${err.stack || err.message || err}`);
  }
}
