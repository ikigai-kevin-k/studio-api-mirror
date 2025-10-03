import { LoggerService } from 'src/log';

export async function send<T>(
  process: () => Promise<T>,
  maxRetry: number,
  logger?: LoggerService,
): Promise<T> {
  let attempt = 0;
  let reason = '';
  while (attempt < maxRetry) {
    try {
      return await process();
    } catch (error) {
      ++attempt;
      reason = (error as Error).message;
      logger?.error(reason);
    }
  }

  throw new Error(reason);
}
