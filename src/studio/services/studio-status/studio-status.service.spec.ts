// studio-status.service.spec.ts
/* eslint-disable unicorn/no-null */
/* eslint-disable unicorn/no-useless-undefined */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoggerService } from '@ikigaians/logger';
import { CacheService } from 'src/cache/cache.service';
import { StudioStatus } from 'src/studio/entities/studio-status.entity';
import { StudioNotFoundError } from 'src/studio/errors/studio-not-found.error';
import { StudioStatusRepository } from 'src/studio/repositories/studio-status/studio-status.repository';
import { InsertTableStatusResult } from 'src/studio/repositories/studio-status/studio-status.repository.type';
import { StudioStatusService } from 'src/studio/services/studio-status/studio-status.service';
import {
  StudioStatusServiceOutput,
  UpdateStudioStatusServiceInput,
} from 'src/studio/services/studio-status/studio-status.service.type';

const mockStudioStatusRepository = {
  getTableStatusByTableID: jest.fn(),
  insertTableStatus: jest.fn(),
  updateTableStatus: jest.fn(),
  getStudioStatus: jest.fn(),
} as unknown as StudioStatusRepository;

const mockCacheService = {
  get: jest.fn(),
  set: jest.fn(),
} as unknown as CacheService;

const mockLoggerService = {
  info: jest.fn(),
  error: jest.fn(),
} as unknown as LoggerService;

describe('StudioStatusService', () => {
  let service: StudioStatusService;

  beforeEach(() => {
    service = new StudioStatusService(
      mockStudioStatusRepository,
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

  describe('getTableStatusByTableID', () => {
    it('should return a StudioStatus entity if found', async () => {
      const mockStatus: StudioStatus = {
        id: 1,
        tableId: 'status-table-1',
        uptime: 1,
        timestamp: new Date(),
        maintenance: false,
        sdp: 'OK',
        idp: 'OK',
        broker: 'OK',
        zCam: 'OK',
        roulette: 'OK',
        shaker: 'OK',
        barcodeScanner: 'OK',
        nfcScanner: 'OK',
      };
      (mockStudioStatusRepository.getTableStatusByTableID as jest.Mock).mockResolvedValue(
        mockStatus,
      );
      const result = await service.getTableStatusByTableID('status-table-1');
      expect(result).toEqual(mockStatus);
    });

    it('should throw StudioNotFoundError if not found', async () => {
      (mockStudioStatusRepository.getTableStatusByTableID as jest.Mock).mockResolvedValue(null);
      await expect(service.getTableStatusByTableID('non-existent')).rejects.toThrow(
        StudioNotFoundError,
      );
    });
  });

  describe('getCaches', () => {
    it('should return data from cache if it exists', async () => {
      const mockCacheData = new Map<string, StudioStatusServiceOutput>();
      mockCacheData.set('table1', { tableId: 'table1', uptime: 10 });
      const mockCacheString = JSON.stringify([...mockCacheData]);
      (mockCacheService.get as jest.Mock).mockResolvedValue(mockCacheString);
      const result = await service.getCaches();
      expect(mockCacheService.get).toHaveBeenCalledWith('status');
      expect(result).toEqual(mockCacheData);
    });

    it('should fetch from repository if cache does not exist', async () => {
      (mockCacheService.get as jest.Mock).mockResolvedValue(null);
      const mockRepoData: any[] = [{ tableId: 'table1', uptime: 10 }];
      (mockStudioStatusRepository.getStudioStatus as jest.Mock).mockResolvedValue(mockRepoData);
      const result = await service.getCaches();
      expect(mockStudioStatusRepository.getStudioStatus).toHaveBeenCalledTimes(1);
      const expectedMap = new Map();
      expectedMap.set('table1', mockRepoData[0]);
      expect(result).toEqual(expectedMap);
    });
  });

  describe('refreshCache', () => {
    it('should merge new data into existing cache', async () => {
      const initialCache = new Map<string, StudioStatusServiceOutput>();
      initialCache.set('table1', { tableId: 'table1', uptime: 10, maintenance: false });
      jest.spyOn(service, 'getCaches' as any).mockResolvedValue(initialCache);

      const newCacheData: StudioStatusServiceOutput = { tableId: 'table1', uptime: 20 };
      await service.refreshCache(newCacheData);
      const expectedMap = new Map(initialCache);
      expectedMap.set('table1', { tableId: 'table1', uptime: 20, maintenance: false });
      expect(mockCacheService.set).toHaveBeenCalledWith(
        'status',
        JSON.stringify([...expectedMap]),
        86_400,
      );
    });
  });

  describe('getTableStatus', () => {
    it('should return status from cache', async () => {
      const mockOutput: StudioStatusServiceOutput = { tableId: 'table1', uptime: 10 };
      jest.spyOn(service, 'getCache' as any).mockResolvedValue(mockOutput);
      const result = await service.getTableStatus({ tableId: 'table1' });
      expect(result).toEqual(mockOutput);
    });

    it('should throw error if status not in cache', async () => {
      jest.spyOn(service, 'getCache' as any).mockResolvedValue(undefined);
      await expect(service.getTableStatus({ tableId: 'non-existent' })).rejects.toThrow(
        StudioNotFoundError,
      );
    });
  });

  describe('insertTableStatus', () => {
    it('should insert and refresh cache', async () => {
      const mockRepoResult: InsertTableStatusResult = {
        TABLE_ID: 'table1',
        UPTIME: 0,
        TIMESTAMP: new Date(),
        MAINTENANCE: false,
        SDP: '',
        IDP: '',
        BROKER: '',
        Z_CAM: '',
        ROULETTE: '',
        SHAKER: '',
        BARCODE_SCANNER: '',
        NFC_SCANNER: '',
      };
      (mockStudioStatusRepository.insertTableStatus as jest.Mock).mockResolvedValue(mockRepoResult);
      jest.spyOn(service, 'refreshCache' as any).mockResolvedValue(undefined);
      const result = await service.insertTableStatus({ tableId: 'table1' });
      expect(mockStudioStatusRepository.insertTableStatus).toHaveBeenCalledWith('table1');
      expect(result.tableId).toBe('table1');
      expect((service as any).refreshCache).toHaveBeenCalled();
    });
  });

  describe('updateTableStatus', () => {
    it('should update and refresh cache on success', async () => {
      (mockStudioStatusRepository.updateTableStatus as jest.Mock).mockResolvedValue(1);
      jest.spyOn(service, 'refreshCache' as any).mockResolvedValue(undefined);
      const type = { tableId: 'table1', uptime: 10 };
      const result = await service.updateTableStatus(type);
      expect(mockStudioStatusRepository.updateTableStatus).toHaveBeenCalledWith('table1', {
        uptime: 10,
      });
      expect(result).toEqual({ tableId: 'table1', uptime: 10 });
    });

    it('should throw error if no rows affected', async () => {
      (mockStudioStatusRepository.updateTableStatus as jest.Mock).mockResolvedValue(0);
      const type = { tableId: 'table1', uptime: 10 };
      await expect(service.updateTableStatus(type)).rejects.toThrow(
        new StudioNotFoundError(`tableId table1 hasn't changed`),
      );
    });
  });

  describe('updateTableStatusByWebSocket', () => {
    it('should update and refresh cache', async () => {
      (mockStudioStatusRepository.updateTableStatus as jest.Mock).mockResolvedValue(1);
      jest.spyOn(service, 'refreshCache' as any).mockResolvedValue(undefined);
      const input: UpdateStudioStatusServiceInput = { uptime: 10, sdp: 'OK' };
      const result = await service.updateTableStatusByWebSocket('ws-table', input);
      expect(mockStudioStatusRepository.updateTableStatus).toHaveBeenCalledWith('ws-table', input);
      expect(result).toEqual({ tableId: 'ws-table', ...input });
    });
  });
});
