/* eslint-disable unicorn/no-null */
/* eslint-disable unicorn/numeric-separators-style */
// studio-cache.service.spec.ts
import { CacheService } from '@ikigaians/cache';
import { LoggerService } from '@ikigaians/logger';
import { StudioCacheRepository } from 'src/studio/repositories/studio-cache/studio-cache.repository';
import { StudioCacheService } from 'src/studio/services/studio-cache/studio-cache.service';
import { StudioCacheData } from 'src/studio/services/studio-cache/studio-cache.service.type';

const mockStudioCacheRepository = {
  getStudioCache: jest.fn(),
  getStudioCdnCache: jest.fn(),
  getStudioStatusCache: jest.fn(),
} as unknown as StudioCacheRepository;

const mockCacheService = {
  get: jest.fn(),
  set: jest.fn(),
} as unknown as CacheService;

const mockLoggerService = {
  info: jest.fn(),
  error: jest.fn(),
} as unknown as LoggerService;

describe('StudioCacheService', () => {
  let service: StudioCacheService;

  beforeEach(() => {
    service = new StudioCacheService(
      mockStudioCacheRepository,
      mockCacheService,
      mockLoggerService,
    );
    jest.clearAllMocks();
  });

  describe('onInit', () => {
    it('should be callable and return without errors', async () => {
      await expect(service.onInit()).resolves.toBeUndefined();
    });
  });

  describe('queryCache', () => {
    it('should call getStudioCache when tag is "studio"', async () => {
      const mockData: StudioCacheData[] = [{ tableId: 'uniTest' }];
      (mockStudioCacheRepository.getStudioCache as jest.Mock).mockResolvedValue(mockData);

      const result = await service.queryCache('studio');

      expect(mockStudioCacheRepository.getStudioCache).toHaveBeenCalledTimes(1);
      expect(mockStudioCacheRepository.getStudioCdnCache).not.toHaveBeenCalled();
      expect(mockStudioCacheRepository.getStudioStatusCache).not.toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });

    it('should call getStudioCdnCache when tag is "cdn"', async () => {
      const mockData: StudioCacheData[] = [{ tableId: 'uniTest' }];
      (mockStudioCacheRepository.getStudioCdnCache as jest.Mock).mockResolvedValue(mockData);

      const result = await service.queryCache('cdn');

      expect(mockStudioCacheRepository.getStudioCdnCache).toHaveBeenCalledTimes(1);
      expect(mockStudioCacheRepository.getStudioCache).not.toHaveBeenCalled();
      expect(mockStudioCacheRepository.getStudioStatusCache).not.toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });

    it('should call getStudioCdnCache when tag is "status"', async () => {
      const mockData: StudioCacheData[] = [{ tableId: 'uniTest' }];
      (mockStudioCacheRepository.getStudioStatusCache as jest.Mock).mockResolvedValue(mockData);

      const result = await service.queryCache('status');

      expect(mockStudioCacheRepository.getStudioStatusCache).toHaveBeenCalledTimes(1);
      expect(mockStudioCacheRepository.getStudioCache).not.toHaveBeenCalled();
      expect(mockStudioCacheRepository.getStudioCdnCache).not.toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });

    it('should return an empty array for an unknown tag', async () => {
      const result = await service.queryCache('unknown');

      expect(mockStudioCacheRepository.getStudioCache).not.toHaveBeenCalled();
      expect(mockStudioCacheRepository.getStudioCdnCache).not.toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('getCaches', () => {
    it('should return data from cache if it exists', async () => {
      const mockCacheData = new Map<string, StudioCacheData>();
      mockCacheData.set('uniTest', { tableId: 'uniTest' });
      const mockCacheString = JSON.stringify([...mockCacheData]);

      (mockCacheService.get as jest.Mock).mockResolvedValue(mockCacheString);

      const result = await service.getCaches('studio');

      expect(mockCacheService.get).toHaveBeenCalledWith('studio');
      expect(mockStudioCacheRepository.getStudioCache).not.toHaveBeenCalled();

      expect(result).toEqual(mockCacheData);
    });

    it('should fetch from repository and set cache if cache does not exist', async () => {
      (mockCacheService.get as jest.Mock).mockResolvedValue(null);

      const mockRepositoryData: StudioCacheData[] = [{ tableId: 'uniTest' }];
      (mockStudioCacheRepository.getStudioCache as jest.Mock).mockResolvedValue(mockRepositoryData);

      const result = await service.getCaches('studio');

      expect(mockCacheService.get).toHaveBeenCalledWith('studio');
      expect(mockStudioCacheRepository.getStudioCache).toHaveBeenCalledTimes(1);

      const expectedMap = new Map();
      expectedMap.set('uniTest', mockRepositoryData[0]);

      const expectedCacheString = JSON.stringify([...expectedMap]);

      expect(mockCacheService.set).toHaveBeenCalledWith('studio', expectedCacheString, 86_400);

      expect(result).toEqual(expectedMap);
    });
  });

  describe('getCache', () => {
    it('should return the correct cache entry for a given key', async () => {
      const mockCacheData = new Map<string, StudioCacheData>();
      mockCacheData.set('uniTest', { tableId: 'uniTest' });
      const mockCacheString = JSON.stringify([...mockCacheData]);
      (mockCacheService.get as jest.Mock).mockResolvedValue(mockCacheString);

      const result = await service.getCache('studio', 'uniTest');

      expect(result).toEqual({ tableId: 'uniTest' });
    });

    it('should return undefined if the key is not in cache', async () => {
      const mockCacheData = new Map<string, StudioCacheData>();
      const mockCacheString = JSON.stringify([...mockCacheData]);
      (mockCacheService.get as jest.Mock).mockResolvedValue(mockCacheString);

      const result = await service.getCache('studio', 'non-existent');

      expect(result).toBeUndefined();
    });
  });

  describe('refreshCache', () => {
    it('should refresh the cache with new data', async () => {
      const initialCacheData = new Map<string, StudioCacheData>();
      initialCacheData.set('uniTest', { tableId: 'uniTest' });

      const initialCacheString = JSON.stringify([...initialCacheData]);
      (mockCacheService.get as jest.Mock).mockResolvedValue(initialCacheString);

      const newCache: StudioCacheData = { tableId: 'uniTest' };

      await service.refreshCache('studio', newCache);

      const expectedUpdatedMap = new Map(initialCacheData);
      expectedUpdatedMap.set('uniTest', newCache);

      const expectedUpdatedCacheString = JSON.stringify([...expectedUpdatedMap]);

      expect(mockCacheService.set).toHaveBeenCalledWith(
        'studio',
        expectedUpdatedCacheString,
        86_400,
      );
    });
  });
});
