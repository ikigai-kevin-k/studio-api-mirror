import { LoggerService } from '@ikigaians/logger';
import { AppConfigService } from 'src/config/app-config.service';
import { CacheService } from './cache.service';

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
});
