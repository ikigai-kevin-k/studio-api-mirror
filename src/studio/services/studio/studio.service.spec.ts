// studio.service.spec.ts
/* eslint-disable unicorn/no-null */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable unicorn/no-useless-undefined */
import { LoggerService } from '@ikigaians/logger';
import { CacheService } from 'src/cache/cache.service';
import {
  GetStudioTableRequestType,
  InsertStudioTableRequestType,
  UpdateStudioTableStatusRequestType,
} from 'src/studio/controller/v1/studio/studio.type';
import { StudioTableStatusEnum } from 'src/studio/enums/studio.enums';
import { StudioNotFoundError } from 'src/studio/errors/studio-not-found.error';
import { StudioRepository } from 'src/studio/repositories/studio/studio.repository';
import { InsertStudioTableResult } from 'src/studio/repositories/studio/studio.repository.type';
import { StudioService } from 'src/studio/services/studio/studio.service';
import { schema, StudioServiceOutput } from 'src/studio/services/studio/studio.service.type';

const mockStudioRepository = {
  getStudioTableByTableID: jest.fn(),
  getStudio: jest.fn(),
  insertStudioTable: jest.fn(),
  updateStudioTableStatus: jest.fn(),
} as unknown as StudioRepository;

const mockCacheService = {
  getHashAs: jest.fn(),
  setHash: jest.fn(),
  refresh: jest.fn(),
} as unknown as CacheService;

const mockLoggerService = {
  info: jest.fn(),
  error: jest.fn(),
} as unknown as LoggerService;

describe('StudioService', () => {
  let service: StudioService;

  beforeEach(() => {
    service = new StudioService(mockStudioRepository, mockCacheService, mockLoggerService);
    jest.clearAllMocks();
  });

  describe('onInit', () => {
    it('should be callable and return without errors', async () => {
      await expect(service.onInit()).resolves.toBeUndefined();
    });
  });

  describe('getCacheKey', () => {
    it('should return cache key', async () => {
      expect((service as any).getCacheKey('gameCode')).toBe('studio-gameCode');
    });
  });

  describe('getCache', () => {
    it('should return data from cache if it exists', async () => {
      const mockCacheData: StudioServiceOutput = {
        tableId: 'table1',
        tableStatus: 'ACTIVE',
      };

      (mockCacheService.getHashAs as jest.Mock).mockResolvedValue(mockCacheData);
      const spyGetStudio = jest.spyOn(mockStudioRepository, 'getStudioTableByTableID');
      const spySetCache = jest.spyOn(mockCacheService, 'setHash');

      const result = await service.getCache('table1');

      expect(mockCacheService.getHashAs).toHaveBeenCalledWith('studio-table1', schema);
      expect(spyGetStudio).not.toHaveBeenCalled();
      expect(spySetCache).not.toHaveBeenCalled();
      expect(result).toEqual(mockCacheData);
    });

    it('should fetch from repository and set cache if cache does not exist', async () => {
      (mockCacheService.getHashAs as jest.Mock).mockResolvedValue(undefined);

      const mockRepositoryData: StudioServiceOutput = {
        tableId: 'table1',
        tableStatus: 'ACTIVE',
      };
      (mockStudioRepository.getStudioTableByTableID as jest.Mock).mockResolvedValue(
        mockRepositoryData,
      );

      const result = await service.getCache('table1');

      expect(mockCacheService.getHashAs).toHaveBeenCalledWith('studio-table1', schema);
      expect(mockStudioRepository.getStudioTableByTableID).toHaveBeenCalledWith('table1');

      expect(mockCacheService.setHash).toHaveBeenCalledWith('studio-table1', mockRepositoryData);

      expect(result).toEqual(mockRepositoryData);
    });

    it('should return undefined if db does not exist', async () => {
      (mockCacheService.getHashAs as jest.Mock).mockResolvedValue(undefined);

      (mockStudioRepository.getStudioTableByTableID as jest.Mock).mockResolvedValue(undefined);

      const result = await service.getCache('table1');

      expect(mockCacheService.getHashAs).toHaveBeenCalledWith('studio-table1', schema);
      expect(mockStudioRepository.getStudioTableByTableID).toHaveBeenCalledWith('table1');

      expect(mockCacheService.setHash).toHaveBeenCalledTimes(0);

      expect(result).toBeUndefined();
    });
  });

  describe('getStudioTable', () => {
    it('should return a list of table statuses from internal caches', async () => {
      const spyGetCaches = jest.spyOn(service, 'getCache');
      spyGetCaches.mockResolvedValueOnce({
        tableId: 'table1',
        tableStatus: 'ACTIVE',
      });

      const request: GetStudioTableRequestType = {
        tableId: ['table1', 'table2'],
      };

      const result = await service.getStudioTable(request);

      expect(spyGetCaches).toHaveBeenCalledTimes(2);
      expect(result.list).toEqual([
        {
          tableId: 'table1',
          tableStatus: 'ACTIVE',
        },
      ]);
    });
  });

  describe('insertStudioTable', () => {
    it('should insert a new studio and refresh the cache', async () => {
      const request: InsertStudioTableRequestType = {
        tableId: 'table-new',
        tableStatus: StudioTableStatusEnum.ACTIVE,
      };

      const mockRepoResult: InsertStudioTableResult = {
        TABLE_ID: 'table-new',
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
        tableId: mockRepoResult.TABLE_ID,
        tableStatus: mockRepoResult.TABLE_STATUS,
      };

      expect(result).toEqual(expectedOutput);
    });
  });

  describe('updateStudioTableStatus', () => {
    it('should update studio status and refresh the cache', async () => {
      const request: UpdateStudioTableStatusRequestType = {
        tableId: 'table-1',
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
      expect(mockCacheService.refresh).not.toHaveBeenCalled();
    });
  });
});
