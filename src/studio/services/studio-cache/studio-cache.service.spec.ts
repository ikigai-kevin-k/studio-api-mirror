/* eslint-disable unicorn/no-null */
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

  describe('getCaches', () => {
    it('should return data from cache if it exists', async () => {
      const mockCacheData = new Map<string, StudioCacheResult>([
        [
          'uniTest',
          {
            tableId: 'uniTest',
            tableStatus: StudioTableStatusEnum.INACTIVE,
            cdnDst: {
              primary: {
                hd: 'http://ikg-cit.io/hd.flv',
                hi: 'http://ikg-cit.io/hi.flv',
                me: 'http://ikg-cit.io/me.flv',
                lo: 'http://ikg-cit.io/lo.flv',
              },
              secondary: {
                hd: 'http://ikg-cit.io/hd.flv',
                hi: 'http://ikg-cit.io/hi.flv',
                me: 'http://ikg-cit.io/me.flv',
                lo: 'http://ikg-cit.io/lo.flv',
              },
            },
          } as StudioCacheResult,
        ],
      ]);
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
              hd: 'http://ikg-cit.io/hd.flv',
              hi: 'http://ikg-cit.io/hi.flv',
              me: 'http://ikg-cit.io/me.flv',
              lo: 'http://ikg-cit.io/lo.flv',
            },
            secondary: {
              hd: 'http://ikg-cit.io/hd.flv',
              hi: 'http://ikg-cit.io/hi.flv',
              me: 'http://ikg-cit.io/me.flv',
              lo: 'http://ikg-cit.io/lo.flv',
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

      const expectedCacheString = JSON.stringify([...expectedMap]);

      expect(mockCacheService.set).toHaveBeenCalledWith('studioMap', expectedCacheString, 86_400);

      expect(result).toEqual(expectedMap);
    });
  });

  describe('refreshCache', () => {
    it('should refresh the cache with new data', async () => {
      const initialCacheData = new Map<string, StudioCacheResult>([
        [
          'uniTest',
          {
            tableId: 'uniTest',
            tableStatus: StudioTableStatusEnum.INACTIVE,
            cdnDst: {
              primary: {
                hd: 'http://ikg-cit.io/hd.flv',
                hi: 'http://ikg-cit.io/hi.flv',
                me: 'http://ikg-cit.io/me.flv',
                lo: 'http://ikg-cit.io/lo.flv',
              },
              secondary: {
                hd: 'http://ikg-cit.io/hd.flv',
                hi: 'http://ikg-cit.io/hi.flv',
                me: 'http://ikg-cit.io/me.flv',
                lo: 'http://ikg-cit.io/lo.flv',
              },
            },
          } as StudioCacheResult,
        ],
      ]);
      const initialCacheString = JSON.stringify([...initialCacheData]);

      (mockCacheService.get as jest.Mock).mockResolvedValue(initialCacheString);

      const newCache: StudioCacheResult = {
        tableId: 'uniTest',
        tableStatus: StudioTableStatusEnum.INACTIVE,
        cdnDst: {
          primary: {
            hd: 'http://ikg-cit.io/hd.flv',
            hi: 'http://ikg-cit.io/hi.flv',
            me: 'http://ikg-cit.io/me.flv',
            lo: 'http://ikg-cit.io/lo.flv',
          },
          secondary: {
            hd: 'http://ikg-cit.io/hd.flv',
            hi: 'http://ikg-cit.io/hi.flv',
            me: 'http://ikg-cit.io/me.flv',
            lo: 'http://ikg-cit.io/lo.flv',
          },
        },
      } as StudioCacheResult;

      await service.refreshCache(newCache);

      expect(mockCacheService.get).toHaveBeenCalledWith('studioMap');

      const expectedUpdatedMap = new Map(initialCacheData);
      expectedUpdatedMap.set('uniTest', newCache);

      const expectedUpdatedCacheString = JSON.stringify([...expectedUpdatedMap]);

      expect(mockCacheService.set).toHaveBeenCalledWith(
        'studioMap',
        expectedUpdatedCacheString,
        86_400,
      );
    });
  });
});

describe('StudioCacheResult Model', () => {
  it('should have all properties defined in the StudioCacheResult type', () => {
    const studioCacheResult: StudioCacheResult = {
      tableId: '',
      tableStatus: StudioTableStatusEnum.INACTIVE,
      cdnDst: {
        primary: {
          lo: '',
          me: '',
          hi: '',
          hd: '',
        },
        secondary: {
          lo: '',
          me: '',
          hi: '',
          hd: '',
        },
      },
    };

    expect(studioCacheResult).toBeDefined();
    const expectedKeys = ['tableId', 'tableStatus', 'cdnDst'];

    expect(Object.keys(studioCacheResult)).toEqual(expect.arrayContaining(expectedKeys));
    expect(Object.keys(studioCacheResult).length).toBe(expectedKeys.length);
  });
});

describe('EmptyStudioCacheResult', () => {
  it('should create a valid StudioCacheResult object with correct default values', () => {
    const emptyResult = EmptyStudioCacheResult();

    expect(emptyResult).toBeDefined();
    expect(emptyResult.tableId).toBe('');
    expect(emptyResult.tableStatus).toBe(StudioTableStatusEnum.INACTIVE);
    expect(emptyResult.cdnDst).toStrictEqual({
      primary: {
        hd: '',
        hi: '',
        me: '',
        lo: '',
      },
      secondary: {
        hd: '',
        hi: '',
        me: '',
        lo: '',
      },
    });
  });

  it('should have the correct type inferred by TypeScript', () => {
    const emptyResult = EmptyStudioCacheResult();
    const expectedKeys = Object.keys({} as StudioCacheResult);
    expect(Object.keys(emptyResult)).toEqual(expect.arrayContaining(expectedKeys));
  });
});
