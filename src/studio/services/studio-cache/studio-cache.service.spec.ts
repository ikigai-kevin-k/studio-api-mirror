/* eslint-disable unicorn/no-null */
// studio-cache.service.spec.ts
import { CacheService } from '@ikigaians/cache';
import { LoggerService } from '@ikigaians/logger';
import { StudioTableStatusType } from 'src/studio/enums/studio.enums';
import { StudioCacheResult } from 'src/studio/model/studio-cache/studio-cache.model';
import { StudioCacheRepository } from 'src/studio/repositories/studio-cache/studio-cache.repository';
import { StudioCacheService } from 'src/studio/services/studio-cache/studio-cache.service';

// Mock 掉所有依賴的服務
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
            tableStatus: StudioTableStatusType.INACTIVE,
            primaryHd: 'http://ikg-cit.io/hd.flv',
            primaryHi: 'http://ikg-cit.io/hi.flv',
            primaryMe: 'http://ikg-cit.io/me.flv',
            primaryLo: 'http://ikg-cit.io/lo.flv',
            secondaryHd: 'http://ikg-cit.io/hd.flv',
            secondaryHi: 'http://ikg-cit.io/hi.flv',
            secondaryMe: 'http://ikg-cit.io/me.flv',
            secondaryLo: 'http://ikg-cit.io/lo.flv',
            tableMachine: '',
            dealerPcStatus: '',
            machineType: '',
            machineStatus: '',
            zCamStatus: '',
            sdpStatus: '',
            idpStatus: '',
            streamerStatus: '',
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
          tableStatus: StudioTableStatusType.INACTIVE,
          primaryHd: 'http://ikg-cit.io/hd.flv',
          primaryHi: 'http://ikg-cit.io/hi.flv',
          primaryMe: 'http://ikg-cit.io/me.flv',
          primaryLo: 'http://ikg-cit.io/lo.flv',
          secondaryHd: 'http://ikg-cit.io/hd.flv',
          secondaryHi: 'http://ikg-cit.io/hi.flv',
          secondaryMe: 'http://ikg-cit.io/me.flv',
          secondaryLo: 'http://ikg-cit.io/lo.flv',
          tableMachine: '',
          dealerPcStatus: '',
          machineType: '',
          machineStatus: '',
          zCamStatus: '',
          sdpStatus: '',
          idpStatus: '',
          streamerStatus: '',
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
            tableStatus: StudioTableStatusType.INACTIVE,
            primaryHd: 'http://ikg-cit.io/hd.flv',
            primaryHi: 'http://ikg-cit.io/hi.flv',
            primaryMe: 'http://ikg-cit.io/me.flv',
            primaryLo: 'http://ikg-cit.io/lo.flv',
            secondaryHd: 'http://ikg-cit.io/hd.flv',
            secondaryHi: 'http://ikg-cit.io/hi.flv',
            secondaryMe: 'http://ikg-cit.io/me.flv',
            secondaryLo: 'http://ikg-cit.io/lo.flv',
            tableMachine: '',
            dealerPcStatus: '',
            machineType: '',
            machineStatus: '',
            zCamStatus: '',
            sdpStatus: '',
            idpStatus: '',
            streamerStatus: '',
          } as StudioCacheResult,
        ],
      ]);
      const initialCacheString = JSON.stringify([...initialCacheData]);

      (mockCacheService.get as jest.Mock).mockResolvedValue(initialCacheString);

      const newCache: StudioCacheResult = {
        tableId: 'uniTest',
        tableStatus: StudioTableStatusType.INACTIVE,
        primaryHd: 'http://ikg-cit.io/hd.flv',
        primaryHi: 'http://ikg-cit.io/hi.flv',
        primaryMe: 'http://ikg-cit.io/me.flv',
        primaryLo: 'http://ikg-cit.io/lo.flv',
        secondaryHd: 'http://ikg-cit.io/hd.flv',
        secondaryHi: 'http://ikg-cit.io/hi.flv',
        secondaryMe: 'http://ikg-cit.io/me.flv',
        secondaryLo: 'http://ikg-cit.io/lo.flv',
        tableMachine: '',
        dealerPcStatus: '',
        machineType: '',
        machineStatus: '',
        zCamStatus: '',
        sdpStatus: '',
        idpStatus: '',
        streamerStatus: '',
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
