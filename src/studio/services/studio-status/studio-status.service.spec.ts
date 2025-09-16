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
  schema,
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
  getHashAs: jest.fn(),
  setHash: jest.fn(),
  refresh: jest.fn(),
  has: jest.fn(),
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

  describe('getCacheKey', () => {
    it('should return cache key', async () => {
      expect((service as any).getCacheKey('gameCode')).toBe('studio-status-gameCode');
    });
  });

  describe('getCache', () => {
    it('should return data from cache if it exists', async () => {
      const mockCacheData: StudioStatusServiceOutput = { tableId: 'table1', uptime: 10 };
      (mockCacheService.getHashAs as jest.Mock).mockResolvedValue(mockCacheData);

      const result = await service.getCache('table1');
      expect(mockCacheService.getHashAs).toHaveBeenCalledWith(`studio-status-table1`, schema);
      expect(result).toEqual(mockCacheData);
    });

    it('should fetch from repository if cache does not exist', async () => {
      (mockCacheService.getHashAs as jest.Mock).mockResolvedValue(undefined);

      const mockCacheData: StudioStatusServiceOutput = { tableId: 'table1', uptime: 10 };
      (mockStudioStatusRepository.getTableStatusByTableID as jest.Mock).mockResolvedValue(
        mockCacheData,
      );

      const result = await service.getCache('table1');
      expect(mockCacheService.getHashAs).toHaveBeenCalledWith(`studio-status-table1`, schema);
      expect(mockStudioStatusRepository.getTableStatusByTableID).toHaveBeenCalledTimes(1);
      expect(mockCacheService.setHash).toHaveBeenCalledWith(`studio-status-table1`, mockCacheData);
      expect(result).toEqual(mockCacheData);
    });

    it('should return undefined if db does not exist', async () => {
      (mockCacheService.getHashAs as jest.Mock).mockResolvedValue(undefined);

      (mockStudioStatusRepository.getTableStatusByTableID as jest.Mock).mockResolvedValue(
        undefined,
      );

      const result = await service.getCache('table1');
      expect(mockCacheService.getHashAs).toHaveBeenCalledWith(`studio-status-table1`, schema);
      expect(mockStudioStatusRepository.getTableStatusByTableID).toHaveBeenCalledWith('table1');
      expect(mockCacheService.setHash).toHaveBeenCalledTimes(0);
      expect(result).toBeUndefined();
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
      const result = await service.insertTableStatus({ tableId: 'table1' });
      expect(mockStudioStatusRepository.insertTableStatus).toHaveBeenCalledWith('table1');
      expect(result.tableId).toBe('table1');
    });
  });

  describe('updateTableStatus', () => {
    it('should update and refresh cache on success', async () => {
      (mockStudioStatusRepository.updateTableStatus as jest.Mock).mockResolvedValue(1);
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
        new StudioNotFoundError(`gameCode table1 hasn't changed`),
      );
    });
  });

  describe('updateTableStatusByWebSocket', () => {
    it('should update and refresh cache', async () => {
      (mockStudioStatusRepository.updateTableStatus as jest.Mock).mockResolvedValue(1);
      const input: UpdateStudioStatusServiceInput = { uptime: 10, sdp: 'OK' };
      const result = await service.updateTableStatusByWebSocket('ws-table', input);
      expect(mockStudioStatusRepository.updateTableStatus).toHaveBeenCalledWith('ws-table', input);
      expect(result).toEqual({ tableId: 'ws-table', ...input });
    });

    it('should throw error', async () => {
      (mockStudioStatusRepository.updateTableStatus as jest.Mock).mockResolvedValue(0);
      const input: UpdateStudioStatusServiceInput = { uptime: 10, sdp: 'OK' };
      await expect(service.updateTableStatusByWebSocket('ws-table', input)).rejects.toThrow(
        `gameCode ws-table hasn't changed`,
      );
      expect(mockStudioStatusRepository.updateTableStatus).toHaveBeenCalledWith('ws-table', input);
    });
  });
});
