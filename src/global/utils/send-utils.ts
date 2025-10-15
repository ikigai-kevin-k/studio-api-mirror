import { LoggerService } from 'src/log';

export async function send<T>(
  process: () => Promise<T>,
  maxRetry: number,
  logger?: LoggerService,
): Promise<T> {
  let attempt = 0;
  while (attempt < maxRetry) {
    try {
      return await process();
    } catch (error) {
      ++attempt;
      logger?.error((error as Error).message);
      if (maxRetry <= attempt) {
        throw error;
      }
    }
  }

  throw new Error('Unexpected execution flow: process should have returned or thrown.');
}
