import { LoggerService } from 'src/log';
import { Logger } from 'typeorm';

export class DbLoggerService implements Logger {
  constructor(private readonly logger: LoggerService) {}

  log(level: 'log' | 'info' | 'warn', message: string) {
    this.logger.debug(message);
  }

  logMigration(message: string) {
    this.logger.debug(message);
  }

  logQuery(query: string, parameters?: unknown[]) {
    if (process.env.LOCAL_DISABLE_DB_LOG_QUERY != 'true') {
      this.logger.debug(`query: ${query}, parameters: ${JSON.stringify(parameters)}`);
    }
  }

  logQueryError(error: string | Error, query: string, parameters?: unknown[]) {
    this.logger.warn(`query: ${query}, parameters: ${JSON.stringify(parameters)}, error: ${error}`);
  }

  logQuerySlow(time: number, query: string, parameters?: unknown[]) {
    this.logger.warn(
      `query is slow: ${query}, parameters: ${JSON.stringify(parameters)}, time: ${time}`,
    );
  }

  logSchemaBuild(message: string) {
    this.logger.debug(message);
  }
}
