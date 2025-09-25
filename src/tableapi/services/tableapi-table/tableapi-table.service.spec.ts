// table-api-signal.service.spec.ts
/* eslint-disable unicorn/no-useless-undefined */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CacheService } from 'src/cache/cache.service';
import { AppConfigService } from 'src/config';
import { LoggerService } from 'src/log';
import { send } from 'src/utils/send-utils';
import { fetch } from 'undici';
import { TableApiTableService } from './tableapi-table.service';

jest.mock('undici');
const mockedFetch = fetch as jest.Mock;

jest.mock('@ikigaians/web', () => ({
  getLiveTableSessionHeaders: jest.fn(() => ({ Cookie: 'mock-cookie' })),
}));

jest.mock('src/utils/send-utils', () => ({
  send: jest.fn(),
}));

const mockCacheService = {
  hmGet: jest.fn(),
  hSet: jest.fn(),
} as unknown as CacheService;

const mockAppConfigService = {
  tableApiConfig: { url: 'http://tableapi.test.com', maxRetry: 3 },
} as unknown as AppConfigService;

const mockLoggerService = {
  error: jest.fn(),
  info: jest.fn(),
} as unknown as LoggerService;

describe('TableApiTableService', () => {
  let service: TableApiTableService;
  let mockSend: jest.Mock;

  beforeEach(() => {
    service = new TableApiTableService(mockCacheService, mockAppConfigService, mockLoggerService);
    jest.clearAllMocks();
    mockSend = send as jest.Mock;
  });

  describe('onInit', () => {
    it('should be callable and return without errors', async () => {
      await expect(service.onInit()).resolves.toBeUndefined();
    });
  });

  describe('sendTable', () => {
    it('should call fetch with the correct parameters and return json on success', async () => {
      const mockGameCode = 'gameId';
      const mockResponse = {
        ok: true,
        status: 200,
        json: () => Promise.resolve({ success: true }),
      };
      mockedFetch.mockResolvedValue(mockResponse);

      const result = await (service as any).sendTable(mockGameCode);

      expect(mockedFetch).toHaveBeenCalledWith(
        'http://tableapi.test.com/v2/service/tables/gameId',
        {
          method: 'GET',
          headers: { Cookie: 'mock-cookie', 'content-type': 'application/json' },
        },
      );
      expect(result).toEqual({ success: true });
    });

    it('should throw an error if the fetch response is not ok', async () => {
      const mockGameCode = 'gameId';
      const mockResponse = {
        ok: false,
        status: 400,
        error: { code: 10_001, message: '' },
        json: () => Promise.resolve(mockResponse),
      };
      mockedFetch.mockResolvedValue(mockResponse);

      await expect((service as any).sendTable(mockGameCode)).rejects.toBeDefined();
    });
  });

  describe('queryTableName', () => {
    const mockGameCode = 'gameId';

    it('should return the response if send is successful', async () => {
      const mockResp = { data: { table: { name: 'sci bo' } } };
      mockSend.mockResolvedValue(mockResp);

      const result = await (service as any).queryTableName(mockGameCode);

      expect(mockSend).toHaveBeenCalledWith(
        expect.any(Function),
        mockAppConfigService.tableApiConfig.maxRetry,
        mockLoggerService,
      );
      expect(result).toEqual('sci bo');
    });
  });

  describe('getCache', () => {
    it('should return data from cache if it exists', async () => {
      const mockCacheData: string[] = ['sci bo'];

      (mockCacheService.hmGet as jest.Mock).mockResolvedValue(mockCacheData);

      const result = await (service as any).getCache('gameId');

      expect(mockCacheService.hmGet).toHaveBeenCalledTimes(1);
      expect(result).toEqual('sci bo');
    });

    it('should query data if cache does not hit', async () => {
      const mockCacheData: string[] = [''];
      (mockCacheService.hmGet as jest.Mock).mockResolvedValue(mockCacheData);

      const spyQueryTableName = jest.spyOn(service as any, 'queryTableName');
      spyQueryTableName.mockResolvedValue('sci bo');

      const result = await (service as any).getCache('gameId');

      expect(mockCacheService.hSet).toHaveBeenCalledTimes(1);
      expect(result).toEqual('sci bo');
    });
  });

  describe('getTableName', () => {
    it('should return data from cache', async () => {
      const spyGetCache = jest.spyOn(service as any, 'getCache');
      spyGetCache.mockResolvedValue('sci bo');

      const result = await service.getTableName('gameId');
      expect(result).toEqual('sci bo');
    });
  });
});
