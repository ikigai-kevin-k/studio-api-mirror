/* eslint-disable unicorn/no-null */
// studio.service.spec.ts
import { LoggerService } from '@ikigaians/logger';
import {
  GetStudioTableRequestType,
  UpsertStudioTableRequestType,
} from 'src/studio/controller/v1/studio/studio.type';
import { Studio } from 'src/studio/entities/studio.entity';
import { StudioTableStatusEnum } from 'src/studio/enums/studio.enums';
import { StudioNotFoundError } from 'src/studio/errors/studio-not-found.error';
import { StudioRepository } from 'src/studio/repositories/studio/studio.repository';
import { StudioCacheService } from 'src/studio/services/studio-cache/studio-cache.service';
import { StudioCacheResult } from 'src/studio/services/studio-cache/studio-cache.service.type';
import { StudioService } from 'src/studio/services/studio/studio.service';

// Mock 掉所有依賴的服務
const mockStudioRepository = {
  getStudioTableByTableID: jest.fn(),
  upsertStudio: jest.fn(),
} as unknown as StudioRepository;

const mockStudioCacheService = {
  getCaches: jest.fn(),
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

  describe('upsertTableCdn', () => {
    it('should upsert data and refresh cache if it is not equal to cache data', async () => {
      const request: UpsertStudioTableRequestType = {
        tableId: 'UniTest',
        tableStatus: StudioTableStatusEnum.INACTIVE,
      };

      const mockUpsertResult = {
        TABLE_ID: 'UniTest',
        TABLE_STATUS: 'inactive',
      };

      (mockStudioRepository.upsertStudio as jest.Mock).mockResolvedValue(mockUpsertResult);

      const result = await service.upsertStudioTable(request);

      expect(mockStudioCacheService.getCaches).toHaveBeenCalledTimes(1);
      expect(mockStudioRepository.upsertStudio).toHaveBeenCalledTimes(1);
      expect(mockStudioCacheService.refreshCache).toHaveBeenCalledTimes(1);

      expect(result).toEqual({
        tableId: 'UniTest',
        tableStatus: 'inactive',
      });
    });
  });
});
