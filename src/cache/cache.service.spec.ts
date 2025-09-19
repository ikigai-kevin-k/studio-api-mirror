/* eslint-disable unicorn/no-useless-undefined */
/* eslint-disable unicorn/numeric-separators-style */
import { LoggerService } from '@ikigaians/logger';
import { AppConfigService } from 'src/config/app-config.service';
import { CacheService } from './cache.service';
import { Schema } from './cache.service.type';

describe('CacheService', () => {
  let logger: LoggerService;
  let appConfigService: AppConfigService;
  let cacheService: CacheService;

  beforeEach(() => {
    process.env.APP_ENV = 'DEV';
    process.env.APP_NAME = 'test';
    logger = { info: jest.fn() } as unknown as LoggerService;
    appConfigService = { cacheConfig: {} } as unknown as AppConfigService;
    cacheService = new CacheService(logger, appConfigService);
  });

  it('should instantiate CacheService', () => {
    expect(cacheService).toBeInstanceOf(CacheService);
  });

  it('should call connect on onInit', async () => {
    cacheService.connect = jest.fn();
    await cacheService.onInit();
    expect(cacheService.connect).toHaveBeenCalledWith(appConfigService.cacheConfig);
  });

  it('should call disconnect on onDispose', async () => {
    cacheService.disconnect = jest.fn();
    await cacheService.onDispose();
    expect(cacheService.disconnect).toHaveBeenCalled();
  });

  describe('getHashAs', () => {
    const mockKey = 'test-key';
    const mockSchema = {
      str: 'string',
      num: 'number',
      bool: 'boolean',
      date: 'date',
      obj: 'object',
    } as Schema<{
      str: string;
      num: number;
      bool: boolean;
      date: Date;
      obj: object;
    }>;

    it('should return undefined if the key does not exist', async () => {
      cacheService.hGetAll = jest.fn();
      (cacheService.hGetAll as jest.Mock).mockResolvedValue({});
      const result = await cacheService.getHashAs(mockKey, mockSchema);
      expect(result).toBeUndefined();
    });

    it('should return an object with correctly parsed values if the key exists', async () => {
      cacheService.hGetAll = jest.fn();
      (cacheService.hGetAll as jest.Mock).mockResolvedValue({
        str: 'hello',
        num: '123',
        bool: 'true',
        date: '1672531200000',
        obj: '{"a":1}',
      });

      const result = await cacheService.getHashAs(mockKey, mockSchema);

      expect(result).toEqual({
        str: 'hello',
        num: 123,
        bool: true,
        date: new Date(1672531200000),
        obj: { a: 1 },
      });
    });

    it('should return undefined if a field in the schema is missing from the hash', async () => {
      cacheService.hGetAll = jest.fn();
      (cacheService.hGetAll as jest.Mock).mockResolvedValue({});

      const result = await cacheService.getHashAs(mockKey, mockSchema);
      expect(result).toBeUndefined();
    });
  });

  describe('setHash', () => {
    const mockKey = 'test-key';
    const mockTtl = 3600;

    it('should correctly set a hash with various data types', async () => {
      const mockCache = {
        str: 'hello',
        num: 123,
        bool: true,
        date: new Date(1672531200000),
        obj: { a: 1 },
        undef: undefined,
      };

      cacheService.hSet = jest.fn();
      cacheService.expire = jest.fn();

      await cacheService.setHash(mockKey, mockCache, mockTtl);

      expect(cacheService.hSet).toHaveBeenCalledWith(
        mockKey,
        new Map([
          ['str', 'hello'],
          ['num', '123'],
          ['bool', 'true'],
          ['date', '1672531200000'],
          ['obj', '{"a":1}'],
        ]),
      );
      expect(cacheService.expire).toHaveBeenCalledWith(mockKey, mockTtl);
    });

    it('should not call hSet or expire if the cache object is empty after filtering', async () => {
      const mockCache = {
        undef: undefined,
      };

      cacheService.hSet = jest.fn();
      cacheService.expire = jest.fn();

      await cacheService.setHash(mockKey, mockCache);

      expect(cacheService.hSet).not.toHaveBeenCalled();
      expect(cacheService.expire).not.toHaveBeenCalled();
    });
  });
});
