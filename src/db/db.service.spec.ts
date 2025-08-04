import { LogLevelsEnum } from '@ikigaians/logger';
import { AppConfigService } from 'src/config';
import { LoggerService } from 'src/log';
import { DataSource } from 'typeorm';
import { DbLoggerService } from './db-logger/db-logger.service';
import { DbService } from './db.service';

jest.mock('typeorm', () => ({
  DataSource: jest.fn().mockImplementation(() => ({
    initialize: jest.fn(),
    destroy: jest.fn(),
    isInitialized: true,
  })),
  PrimaryGeneratedColumn: jest.fn(),
  Column: jest.fn(),
  OneToMany: jest.fn(),
  ManyToOne: jest.fn(),
  OneToOne: jest.fn(),
  JoinColumn: jest.fn(),
  CreateDateColumn: jest.fn(),
  PrimaryColumn: jest.fn(),
  UpdateDateColumn: jest.fn(),
  Index: jest.fn(),
  Entity: jest.fn(),
}));

describe('DbService', () => {
  let service: DbService;
  let appConfigService: AppConfigService;
  let logger: LoggerService;
  let dbLogger: DbLoggerService;

  beforeEach(() => {
    appConfigService = {
      dbConfig: {
        master: {
          host: 'host',
          port: 123,
          username: 'user',
          password: 'password',
          database: 'dbName',
        },
        slaves: [],
        logger: { level: LogLevelsEnum.DEBUG },
      },
    } as unknown as AppConfigService;

    logger = {
      info: jest.fn(),
      error: jest.fn(),
    } as unknown as LoggerService;

    dbLogger = {
      log: jest.fn(),
    } as unknown as DbLoggerService;

    service = new DbService(logger, appConfigService, dbLogger);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getConnection', () => {
    it('should return the database connection if it is initialized', async () => {
      await service.connect();
      const connection = service.getConnection();
      expect(connection).toBeDefined();
      expect(connection.isInitialized).toBe(true);
    });

    it('should throw an error if the database connection is not initialized', () => {
      expect(() => service.getConnection()).toThrow('DB is not connected');
    });
  });

  describe('connect', () => {
    it.each(['connect', 'onInit'])('should connect to DB by %s', async (name) => {
      await service[name as keyof typeof service]();
      const connection = service.getConnection();

      expect(DataSource).toHaveBeenCalledWith({
        type: 'postgres',
        replication: {
          master: {
            host: 'host',
            port: 123,
            username: 'user',
            password: 'password',
            database: 'dbName',
          },
          slaves: [],
          defaultMode: 'master',
        },
        ssl: undefined,
        extra: undefined,
        synchronize: false,
        logging: ['query', 'error'],
        logger: dbLogger,
      });
      expect(connection.initialize).toHaveBeenCalled();
    });

    it('should throw an error if connection fails', async () => {
      (DataSource as jest.Mock).mockImplementationOnce(() => ({
        initialize: jest.fn().mockRejectedValue(new Error('test error')),
      }));

      await expect(service.connect()).rejects.toThrow('test error');
    });

    it('should connect to DB with error logging only', async () => {
      const config = {
        dbConfig: {
          ...appConfigService.dbConfig,
          logger: { level: LogLevelsEnum.INFO },
        },
      } as unknown as AppConfigService;

      const service = new DbService(logger, config, dbLogger);

      await service.connect();
      const connection = service.getConnection();

      expect(DataSource).toHaveBeenCalledWith(
        expect.objectContaining({
          logging: ['error'],
          logger: dbLogger,
        }),
      );
      expect(connection.initialize).toHaveBeenCalled();
    });
  });

  describe('disconnect', () => {
    it.each(['disconnect', 'onDispose'])('should disconnect from DB when %s', async (name) => {
      await service.connect();
      const connection = service.getConnection();
      await service[name as keyof typeof service]();

      expect(connection.destroy).toHaveBeenCalled();
    });
  });

  describe('isConnected', () => {
    it('should return DB connection status', async () => {
      await service.connect();
      const result = await service.isConnected();

      expect(result).toBe(true);
    });

    it('should return false when the database is not connected', async () => {
      expect(await service.isConnected()).toBe(false);
    });
  });

  describe('getConnection', () => {
    it('should not return DB connection if connect() was not called', async () => {
      expect(() => service.getConnection()).toThrow('DB is not connected');
    });
  });

  describe('AWS RDS', () => {
    it('should connect with parameter rejectUnauthorized when ssl is true', async () => {
      appConfigService = {
        dbConfig: {
          master: {
            host: 'host',
            port: 123,
            user: 'user',
            password: 'password',
            dbName: 'dbName',
            ssl: true,
          },
          slaves: [],
          logger: { level: LogLevelsEnum.DEBUG },
        },
      } as unknown as AppConfigService;

      service = new DbService(logger, appConfigService, dbLogger);
      await service.connect();

      expect(DataSource).toHaveBeenCalledWith(
        expect.objectContaining({
          ssl: true,
          extra: { ssl: { rejectUnauthorized: false } },
        }),
      );
    });
  });
});
