import { LoggerService } from 'src/log/logger.service';
import { DbLoggerService } from './db-logger.service';

describe('DbLoggerService', () => {
  let logger: LoggerService;
  let dbLoggerService: DbLoggerService;

  beforeEach(() => {
    logger = { debug: jest.fn(), warn: jest.fn() } as unknown as LoggerService;
    dbLoggerService = new DbLoggerService(logger);
  });

  it('should log with debug for log, logMigration, logQuery, logSchemaBuild', () => {
    dbLoggerService.log('info', 'test');
    dbLoggerService.logMigration('migration');
    dbLoggerService.logQuery('SELECT 1', ['a']);
    dbLoggerService.logSchemaBuild('schema');
    expect(logger.debug).toHaveBeenCalledTimes(4);
  });

  it('should log with warn for logQueryError and logQuerySlow', () => {
    dbLoggerService.logQueryError('error', 'SELECT 1', ['a']);
    dbLoggerService.logQuerySlow(1000, 'SELECT 1', ['a']);
    expect(logger.warn).toHaveBeenCalledTimes(2);
  });

  it('should not log query if LOCAL_DISABLE_DB_LOG_QUERY is true', () => {
    process.env.LOCAL_DISABLE_DB_LOG_QUERY = 'true';
    dbLoggerService.logQuery('SELECT 1', ['a']);
    expect(logger.debug).not.toHaveBeenCalledWith(expect.stringContaining('query: SELECT 1'));
    process.env.LOCAL_DISABLE_DB_LOG_QUERY = undefined;
  });
});
