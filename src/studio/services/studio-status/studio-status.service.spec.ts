// studio-status.service.spec.ts
/* eslint-disable unicorn/no-null */
/* eslint-disable unicorn/no-useless-undefined */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoggerService } from '@ikigaians/logger';
import { CacheService } from 'src/cache/cache.service';
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

  describe('getCache', () => {
    it('should return data from cache if it exists', async () => {
      const mockCacheData: StudioStatusServiceOutput = { tableId: 'table1', uptime: 10 };
      (mockCacheService.get as jest.Mock).mockResolvedValue(JSON.stringify(mockCacheData));

      const result = await service.getCache('table1');
      expect(mockCacheService.get).toHaveBeenCalledWith(`studio-status-table1`);
      expect(result).toEqual(mockCacheData);
    });

    it('should fetch from repository if cache does not exist', async () => {
      (mockCacheService.get as jest.Mock).mockResolvedValue(null);

      const mockCacheData: StudioStatusServiceOutput = { tableId: 'table1', uptime: 10 };
      (mockStudioStatusRepository.getTableStatusByTableID as jest.Mock).mockResolvedValue(
        mockCacheData,
      );

      const result = await service.getCache('table1');
      expect(mockCacheService.get).toHaveBeenCalledWith(`studio-status-table1`);
      expect(mockStudioStatusRepository.getTableStatusByTableID).toHaveBeenCalledTimes(1);
      expect(mockCacheService.set).toHaveBeenCalledWith(
        `studio-status-table1`,
        JSON.stringify(mockCacheData),
        86_400,
      );
      expect(result).toEqual(mockCacheData);
    });

    it('should return undefined if db does not exist', async () => {
      (mockCacheService.get as jest.Mock).mockResolvedValue(null);

      (mockStudioStatusRepository.getTableStatusByTableID as jest.Mock).mockResolvedValue(
        undefined,
      );

      const result = await service.getCache('table1');
      expect(mockCacheService.get).toHaveBeenCalledWith(`studio-status-table1`);
      expect(mockStudioStatusRepository.getTableStatusByTableID).toHaveBeenCalledWith('table1');
      expect(mockCacheService.set).toHaveBeenCalledTimes(0);
      expect(result).toBeUndefined();
    });
  });

  describe('refreshCache', () => {
    it('should merge new data into existing cache', async () => {
      const initialCache = { tableId: 'table1', uptime: 10, maintenance: false };
      jest.spyOn(service, 'getCache' as any).mockResolvedValue(initialCache);

      const newCacheData: StudioStatusServiceOutput = { tableId: 'table1', uptime: 20 };
      await service.refreshCache(newCacheData);
      expect(mockCacheService.set).toHaveBeenCalledWith(
        'studio-status-table1',
        JSON.stringify({ tableId: 'table1', uptime: 20, maintenance: false }),
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
