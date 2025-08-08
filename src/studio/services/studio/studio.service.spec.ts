/* eslint-disable unicorn/no-null */
// studio.service.spec.ts
import { LoggerService } from '@ikigaians/logger';
import {
  GetStudioTableRequestType,
  InsertStudioTableRequestType,
  UpdateStudioTableStatusRequestType,
} from 'src/studio/controller/v1/studio/studio.type';
import { Studio } from 'src/studio/entities/studio.entity';
import { StudioTableStatusEnum } from 'src/studio/enums/studio.enums';
import { StudioNotFoundError } from 'src/studio/errors/studio-not-found.error';
import { StudioRepository } from 'src/studio/repositories/studio/studio.repository';
import { StudioCacheService } from 'src/studio/services/studio-cache/studio-cache.service';
import { StudioCacheResult } from 'src/studio/services/studio-cache/studio-cache.service.type';
import { StudioService } from 'src/studio/services/studio/studio.service';

const mockStudioRepository = {
  getStudioTableByTableID: jest.fn(),
  insertStudioTable: jest.fn(),
  updateStudioTableStatus: jest.fn(),
} as unknown as StudioRepository;

const mockStudioCacheService = {
  getCaches: jest.fn(),
  getCache: jest.fn(),
  refreshCache: jest.fn(),
} as unknown as StudioCacheService;

const mockLoggerService = {
  info: jest.fn(),
  error: jest.fn(),
} as unknown as LoggerService;

jest.mock('src/studio/utilities/cache.utility', () => ({
  isFieldsEqual: jest.fn(),
}));

describe('StudioService', () => {
  let service: StudioService;

  beforeEach(() => {
    service = new StudioService(mockStudioRepository, mockStudioCacheService, mockLoggerService);
    jest.clearAllMocks();
  });

  describe('ModuleLifecycle', () => {
    it('onInit', async () => {
      await service.onInit();
    });
  });

  describe('getStudioTableByTableID', () => {
    it('should return a studio entity if found', async () => {
      const mockStudio: Studio = {
        id: 1,
        tableId: 'UniTest',
        tableStatus: StudioTableStatusEnum.ACTIVE,
      };

      (mockStudioRepository.getStudioTableByTableID as jest.Mock).mockResolvedValue(mockStudio);

      const result = await service.getStudioTableByTableID('UniTest');

      expect(mockStudioRepository.getStudioTableByTableID).toHaveBeenCalledWith('UniTest');
      expect(result).toEqual(mockStudio);
    });

    it('should throw StudioNotFoundError if not found', async () => {
      (mockStudioRepository.getStudioTableByTableID as jest.Mock).mockResolvedValue(null);

      await expect(service.getStudioTableByTableID('non-existent')).rejects.toThrow(
        StudioNotFoundError,
      );
      await expect(service.getStudioTableByTableID('non-existent')).rejects.toThrow(
        `table non-existent not found`,
      );
      expect(mockStudioRepository.getStudioTableByTableID).toHaveBeenCalledWith('non-existent');
    });
  });

  describe('getStudioTable', () => {
    it('should return a list of table statuses from cache', async () => {
      const mockCacheMap = new Map<string, StudioCacheResult>();
      mockCacheMap.set('UniTest', {
        tableId: 'UniTest',
        tableStatus: StudioTableStatusEnum.INACTIVE,
      } as StudioCacheResult);

      (mockStudioCacheService.getCaches as jest.Mock).mockResolvedValue(mockCacheMap);

      const request: GetStudioTableRequestType = {
        tableId: ['UniTest'],
      };

      const result = await service.getStudioTable(request);

      expect(mockStudioCacheService.getCaches).toHaveBeenCalledTimes(1);
      expect(result.list).toEqual([{ tableId: 'UniTest', tableStatus: 'inactive' }]);
    });

    it('should handle undefined tableId array', async () => {
      const mockCacheMap = new Map<string, StudioCacheResult>();
      (mockStudioCacheService.getCaches as jest.Mock).mockResolvedValue(mockCacheMap);

      const request: GetStudioTableRequestType = { tableId: undefined };

      const result = await service.getStudioTable(request);

      expect(result.list).toEqual([]);
    });
  });

  describe('insertTableCdn', () => {
    it('should insert data and refresh cache', async () => {
      const request: InsertStudioTableRequestType = {
        tableId: 'UniTest',
        tableStatus: StudioTableStatusEnum.INACTIVE,
      };

      const mockInsertResult = {
        TABLE_ID: 'UniTest',
        TABLE_STATUS: 'inactive',
      };

      const mockCacheResult = {
        tableId: 'UniTest',
        tableStatus: StudioTableStatusEnum.INACTIVE,
      };

      (mockStudioRepository.insertStudioTable as jest.Mock).mockResolvedValue(mockInsertResult);
      (mockStudioCacheService.getCache as jest.Mock).mockResolvedValue(mockCacheResult);

      const result = await service.insertStudioTable(request);

      expect(mockStudioCacheService.getCache).toHaveBeenCalledTimes(1);
      expect(mockStudioRepository.insertStudioTable).toHaveBeenCalledTimes(1);
      expect(mockStudioCacheService.refreshCache).toHaveBeenCalledTimes(1);

      expect(result).toEqual({
        tableId: 'UniTest',
        tableStatus: 'inactive',
      });
    });
  });

  describe('updateStudioTableStatus', () => {
    it('should update data and refresh cache', async () => {
      const request: UpdateStudioTableStatusRequestType = {
        tableId: 'UniTest',
        tableStatus: StudioTableStatusEnum.INACTIVE,
      };

      const mockCacheResult = {
        tableId: 'UniTest',
        tableStatus: StudioTableStatusEnum.INACTIVE,
      };

      (mockStudioRepository.updateStudioTableStatus as jest.Mock).mockResolvedValue(1);
      (mockStudioCacheService.getCache as jest.Mock).mockResolvedValue(mockCacheResult);

      const result = await service.updateStudioTableStatus(request);

      expect(mockStudioCacheService.getCache).toHaveBeenCalledTimes(1);
      expect(mockStudioRepository.updateStudioTableStatus).toHaveBeenCalledTimes(1);
      expect(mockStudioCacheService.refreshCache).toHaveBeenCalledTimes(1);

      expect(result).toEqual({
        tableId: 'UniTest',
        tableStatus: 'inactive',
      });
    });

    it('should throw StudioNotFoundError if not found', async () => {
      (mockStudioRepository.getStudioTableByTableID as jest.Mock).mockResolvedValue(null);

      await expect(service.getStudioTableByTableID('non-existent')).rejects.toThrow(
        StudioNotFoundError,
      );
      await expect(service.getStudioTableByTableID('non-existent')).rejects.toThrow(
        `table non-existent not found`,
      );
      expect(mockStudioRepository.getStudioTableByTableID).toHaveBeenCalledWith('non-existent');
    });

    it('should throw StudioNotFoundError if not found', async () => {
      const request: UpdateStudioTableStatusRequestType = {
        tableId: 'UniTest',
        tableStatus: StudioTableStatusEnum.INACTIVE,
      };

      (mockStudioRepository.updateStudioTableStatus as jest.Mock).mockResolvedValue(0);

      await expect(service.updateStudioTableStatus(request)).rejects.toThrow(StudioNotFoundError);
    });
  });
});
