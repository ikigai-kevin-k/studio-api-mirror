/* eslint-disable unicorn/no-null */
/* eslint-disable unicorn/numeric-separators-style */
// studio-cache.service.spec.ts
import { CacheService } from '@ikigaians/cache';
import { LoggerService } from '@ikigaians/logger';
import { StudioTableStatusEnum } from 'src/studio/enums/studio.enums';
import { StudioCacheRepository } from 'src/studio/repositories/studio-cache/studio-cache.repository';
import { StudioCacheService } from 'src/studio/services/studio-cache/studio-cache.service';
import {
  EmptyStudioCacheResult,
  StudioCacheResult,
} from 'src/studio/services/studio-cache/studio-cache.service.type';

const mockStudioCacheRepository = {
  getCaches: jest.fn(),
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

  describe('getCaches', () => {
    it('should return data from cache if it exists', async () => {
      const mockCacheData = new Map<string, StudioCacheResult>();
      mockCacheData.set('uniTest', {
        tableId: 'uniTest',
        tableStatus: StudioTableStatusEnum.INACTIVE,
        cdnDst: {
          primary: {
            lo: 'http://ikg-cit.io/hd.flv',
            me: 'http://ikg-cit.io/hd.flv',
            hi: 'http://ikg-cit.io/hd.flv',
            hd: 'http://ikg-cit.io/hd.flv',
          },
          secondary: {
            lo: 'http://ikg-cit.io/hd.flv',
            me: 'http://ikg-cit.io/hd.flv',
            hi: 'http://ikg-cit.io/hd.flv',
            hd: 'http://ikg-cit.io/hd.flv',
          },
        },
      } as StudioCacheResult);
      const mockCacheString = JSON.stringify([...mockCacheData]);

      (mockCacheService.get as jest.Mock).mockResolvedValue(mockCacheString);

      const result = await service.getCaches();

      expect(mockCacheService.get).toHaveBeenCalledWith('studioMap');
      expect(mockStudioCacheRepository.getCaches).not.toHaveBeenCalled();

      expect(result).toEqual(mockCacheData);
    });

    it('should fetch from repository and set cache if cache does not exist', async () => {
      (mockCacheService.get as jest.Mock).mockResolvedValue(null);

      const mockRepositoryData: StudioCacheResult[] = [
        {
          tableId: 'uniTest',
          tableStatus: StudioTableStatusEnum.INACTIVE,
          cdnDst: {
            primary: {
              lo: 'http://ikg-cit.io/hd.flv',
              me: 'http://ikg-cit.io/hd.flv',
              hi: 'http://ikg-cit.io/hd.flv',
              hd: 'http://ikg-cit.io/hd.flv',
            },
            secondary: {
              lo: 'http://ikg-cit.io/hd.flv',
              me: 'http://ikg-cit.io/hd.flv',
              hi: 'http://ikg-cit.io/hd.flv',
              hd: 'http://ikg-cit.io/hd.flv',
            },
          },
        } as StudioCacheResult,
      ];
      (mockStudioCacheRepository.getCaches as jest.Mock).mockResolvedValue(mockRepositoryData);

      const result = await service.getCaches();

      expect(mockCacheService.get).toHaveBeenCalledWith('studioMap');
      expect(mockStudioCacheRepository.getCaches).toHaveBeenCalledTimes(1);

      const expectedMap = new Map();
      expectedMap.set('uniTest', mockRepositoryData[0]);

      expect(result).toEqual(expectedMap);
    });
  });

  describe('getCache', () => {
    it('should return the correct cache entry for a given key', async () => {
      const mockCacheData = new Map<string, StudioCacheResult>();
      const entry1: StudioCacheResult = {
        tableId: 'uniTest',
        tableStatus: StudioTableStatusEnum.INACTIVE,
        cdnDst: {
          primary: {
            lo: 'http://ikg-cit.io/hd.flv',
            me: 'http://ikg-cit.io/hd.flv',
            hi: 'http://ikg-cit.io/hd.flv',
            hd: 'http://ikg-cit.io/hd.flv',
          },
          secondary: {
            lo: 'http://ikg-cit.io/hd.flv',
            me: 'http://ikg-cit.io/hd.flv',
            hi: 'http://ikg-cit.io/hd.flv',
            hd: 'http://ikg-cit.io/hd.flv',
          },
        },
      };
      mockCacheData.set('uniTest', entry1);
      const mockCacheString = JSON.stringify([...mockCacheData]);
      (mockCacheService.get as jest.Mock).mockResolvedValue(mockCacheString);

      const result = await service.getCache('uniTest');

      expect(mockCacheService.get).toHaveBeenCalledWith('studioMap');
      expect(result).toEqual(entry1);
    });

    it('should return EmptyStudioCacheResult if the key is not in cache', async () => {
      const mockCacheData = new Map<string, StudioCacheResult>();
      const mockCacheString = JSON.stringify([...mockCacheData]);
      (mockCacheService.get as jest.Mock).mockResolvedValue(mockCacheString);

      const result = await service.getCache('non-existent');

      expect(result).toEqual(EmptyStudioCacheResult());
    });
  });

  describe('refreshCache', () => {
    it('should refresh the cache with new data', async () => {
      const initialCacheData = new Map<string, StudioCacheResult>();
      const initialEntry: StudioCacheResult = {
        tableId: 'uniTest',
        tableStatus: StudioTableStatusEnum.INACTIVE,
        cdnDst: {
          primary: {
            lo: 'http://ikg-cit.io/hd.flv',
            me: 'http://ikg-cit.io/hd.flv',
            hi: 'http://ikg-cit.io/hd.flv',
            hd: 'http://ikg-cit.io/hd.flv',
          },
          secondary: {
            lo: 'http://ikg-cit.io/hd.flv',
            me: 'http://ikg-cit.io/hd.flv',
            hi: 'http://ikg-cit.io/hd.flv',
            hd: 'http://ikg-cit.io/hd.flv',
          },
        },
      };
      initialCacheData.set('uniTest', initialEntry);

      const initialCacheString = JSON.stringify([...initialCacheData]);
      (mockCacheService.get as jest.Mock).mockResolvedValue(initialCacheString);

      const newCache: StudioCacheResult = {
        tableId: 'uniTest',
        tableStatus: StudioTableStatusEnum.INACTIVE,
        cdnDst: {
          primary: {
            lo: 'http://ikg-cit.io/hd.flv',
            me: 'http://ikg-cit.io/hd.flv',
            hi: 'http://ikg-cit.io/hd.flv',
            hd: 'http://ikg-cit.io/hd.flv',
          },
          secondary: {
            lo: 'http://ikg-cit.io/hd.flv',
            me: 'http://ikg-cit.io/hd.flv',
            hi: 'http://ikg-cit.io/hd.flv',
            hd: 'http://ikg-cit.io/hd.flv',
          },
        },
      };

      await service.refreshCache(newCache);

      expect(mockCacheService.get).toHaveBeenCalledWith('studioMap');

      const expectedUpdatedMap = new Map(initialCacheData);
      expectedUpdatedMap.set('uniTest', newCache);

      const expectedUpdatedCacheString = JSON.stringify([...expectedUpdatedMap]);

      expect(mockCacheService.set).toHaveBeenCalledWith(
        'studioMap',
        expectedUpdatedCacheString,
        86400,
      );
    });
  });
});
