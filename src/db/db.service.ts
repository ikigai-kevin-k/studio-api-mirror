import { LogLevelsEnum } from '@ikigaians/logger';
import { ModuleLifecycle } from '@ikigaians/mod';
import { AppConfigService } from 'src/config';
import { LoggerService } from 'src/log';
import { DataSource } from 'typeorm';
import { LogLevel as DbLogLevel } from 'typeorm/logger/Logger';
import { DbLoggerService } from './db-logger/db-logger.service';

export class DbService implements ModuleLifecycle {
  private connection?: DataSource;

  constructor(
    private readonly logger: LoggerService,
    private readonly appConfigService: AppConfigService,
    private readonly dbLoggerService: DbLoggerService,
  ) {}

  async connect() {
    const {
      master: { host, port, user: username, password, dbName: database, ssl },
      slaves,
      logger,
    } = this.appConfigService.dbConfig;

    const extra = ssl ? { ssl: { rejectUnauthorized: false } } : undefined;

    this.logger.info('connecting to DB');

    try {
      const dbLoggerLevel: DbLogLevel[] =
        logger.level === LogLevelsEnum.DEBUG ? ['query', 'error'] : ['error'];

      this.connection = new DataSource({
        type: 'postgres',
        replication: {
          master: {
            host,
            port,
            username,
            password,
            database,
          },
          slaves,
          defaultMode: 'master',
        },
        ssl,
        extra,
        synchronize: false,
        logging: dbLoggerLevel,
        logger: this.dbLoggerService,
      });

      await this.connection.initialize();

      this.logger.info('connected to DB');
    } catch (error_) {
      const error = error_ as Error;
      this.logger.error(`failed to connect to DB. Error: ${error.message}`);

      throw error;
    }
  }

  async disconnect() {
    await this.connection?.destroy();
    this.logger.info('disconnected from DB');
  }

  async isConnected() {
    return this.connection?.isInitialized ?? false;
  }

  getConnection() {
    if (!this.connection) {
      throw new Error('DB is not connected');
    }

    return this.connection;
  }

  async onInit() {
    await this.connect();
  }

  async onDispose(): Promise<void> {
    await this.disconnect();
  }
}
