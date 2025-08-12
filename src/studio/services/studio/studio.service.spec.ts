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
import { InsertStudioTableResult } from 'src/studio/repositories/studio/studio.repository.type';
import { StudioCacheService } from 'src/studio/services/studio-cache/studio-cache.service';
import { StudioCacheData } from 'src/studio/services/studio-cache/studio-cache.service.type';
import { StudioService } from 'src/studio/services/studio/studio.service';
import { GetStudioTableOutput } from './studio.service.type';

const mockStudioRepository = {
  getStudioTableByTableID: jest.fn(),
  insertStudioTable: jest.fn(),
  updateStudioTableStatus: jest.fn(),
} as unknown as StudioRepository;

const mockStudioCacheService = {
  getCaches: jest.fn(),
  refreshCache: jest.fn(),
} as unknown as StudioCacheService;

const mockLoggerService = {
  info: jest.fn(),
  error: jest.fn(),
} as unknown as LoggerService;

describe('StudioService', () => {
  let service: StudioService;

  beforeEach(() => {
    service = new StudioService(mockStudioRepository, mockStudioCacheService, mockLoggerService);
    jest.clearAllMocks();
  });

  describe('onInit', () => {
    it('should be callable and return without errors', async () => {
      await expect(service.onInit()).resolves.toBeUndefined();
    });
  });

  describe('getStudioTableByTableID', () => {
    it('should return a studio entity if found', async () => {
      const mockStudio: Studio = {
        id: 1,
        tableId: 'uniTest',
        tableStatus: StudioTableStatusEnum.INACTIVE,
      };
      (mockStudioRepository.getStudioTableByTableID as jest.Mock).mockResolvedValue(mockStudio);

      const result = await service.getStudioTableByTableID('uniTest');

      expect(mockStudioRepository.getStudioTableByTableID).toHaveBeenCalledWith('uniTest');
      expect(result).toEqual(mockStudio);
    });

    it('should throw StudioNotFoundError if not found', async () => {
      (mockStudioRepository.getStudioTableByTableID as jest.Mock).mockResolvedValue(null);

      await expect(service.getStudioTableByTableID('non-existent')).rejects.toThrow(
        StudioNotFoundError,
      );
      expect(mockStudioRepository.getStudioTableByTableID).toHaveBeenCalledWith('non-existent');
    });
  });

  describe('getStudioTable', () => {
    it('should return a list of table statuses from cache', async () => {
      const mockCacheMap = new Map<string, StudioCacheData>();
      mockCacheMap.set('uniTest', {
        tableId: 'uniTest',
        tableStatus: StudioTableStatusEnum.INACTIVE,
      } as StudioCacheData);

      (mockStudioCacheService.getCaches as jest.Mock).mockResolvedValue(mockCacheMap);

      const request: GetStudioTableRequestType = {
        tableId: ['uniTest'],
      };

      const result = await service.getStudioTable(request);

      expect(mockStudioCacheService.getCaches).toHaveBeenCalledWith('studio');
      expect(result.list).toEqual([
        { tableId: 'uniTest', tableStatus: StudioTableStatusEnum.INACTIVE },
      ]);
    });

    it('should handle undefined tableId array', async () => {
      const mockCacheMap = new Map<string, StudioCacheData>();
      (mockStudioCacheService.getCaches as jest.Mock).mockResolvedValue(mockCacheMap);

      const request: GetStudioTableRequestType = { tableId: undefined };

      const result = await service.getStudioTable(request);

      expect(result.list).toEqual([]);
    });
  });

  describe('insertStudioTable', () => {
    it('should insert a new studio and refresh the cache', async () => {
      const request: InsertStudioTableRequestType = {
        tableId: 'uniTest',
        tableStatus: StudioTableStatusEnum.ACTIVE,
      };

      const mockRepoResult: InsertStudioTableResult = {
        TABLE_ID: 'uniTest',
        TABLE_STATUS: StudioTableStatusEnum.ACTIVE,
      };

      (mockStudioRepository.insertStudioTable as jest.Mock).mockResolvedValue(mockRepoResult);

      const result = await service.insertStudioTable(request);

      expect(mockStudioRepository.insertStudioTable).toHaveBeenCalledWith(
        expect.objectContaining({
          tableId: request.tableId,
          tableStatus: request.tableStatus,
        }),
      );

      const expectedOutput = {
        tableId: request.tableId,
        tableStatus: request.tableStatus,
      } as GetStudioTableOutput;

      expect(mockStudioCacheService.refreshCache).toHaveBeenCalledWith('studio', expectedOutput);

      expect(result).toEqual(expectedOutput);
    });
  });

  describe('updateStudioTableStatus', () => {
    it('should update studio status and refresh the cache', async () => {
      const request: UpdateStudioTableStatusRequestType = {
        tableId: 'uniTest',
        tableStatus: StudioTableStatusEnum.FAILURE,
      };
      const affectedRows = 1;

      (mockStudioRepository.updateStudioTableStatus as jest.Mock).mockResolvedValue(affectedRows);

      const result = await service.updateStudioTableStatus(request);

      expect(mockStudioRepository.updateStudioTableStatus).toHaveBeenCalledWith(
        expect.objectContaining({
          tableId: request.tableId,
          tableStatus: request.tableStatus,
        }),
      );

      const expectedOutput = {
        tableId: request.tableId,
        tableStatus: request.tableStatus,
      };
      expect(mockStudioCacheService.refreshCache).toHaveBeenCalledWith('studio', expectedOutput);

      expect(result).toEqual(expectedOutput);
    });

    it('should throw StudioNotFoundError if no rows are updated', async () => {
      const request: UpdateStudioTableStatusRequestType = {
        tableId: 'non-existent',
        tableStatus: StudioTableStatusEnum.FAILURE,
      };
      const affectedRows = 0;

      (mockStudioRepository.updateStudioTableStatus as jest.Mock).mockResolvedValue(affectedRows);

      await expect(service.updateStudioTableStatus(request)).rejects.toThrow(StudioNotFoundError);
      expect(mockStudioCacheService.refreshCache).not.toHaveBeenCalled();
    });
  });
});
