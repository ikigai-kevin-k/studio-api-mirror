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
import { Studio } from 'src/studio/entities/studio.entity';
import { StudioTableStatusEnum } from 'src/studio/enums/studio.enums';
import { StudioNotFoundError } from 'src/studio/errors/studio-not-found.error';
import { StudioRepository } from 'src/studio/repositories/studio/studio.repository';
import { InsertStudioTableResult } from 'src/studio/repositories/studio/studio.repository.type';
import { StudioService } from 'src/studio/services/studio/studio.service';
import { StudioTableOutput } from 'src/studio/services/studio/studio.service.type';

const mockStudioRepository = {
  getStudioTableByTableID: jest.fn(),
  getStudioCache: jest.fn(),
  insertStudioTable: jest.fn(),
  updateStudioTableStatus: jest.fn(),
} as unknown as StudioRepository;

const mockCacheService = {
  get: jest.fn(),
  set: jest.fn(),
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

  describe('getStudioTableByTableID', () => {
    it('should return a studio entity if found', async () => {
      const mockStudio: Studio = {
        id: 1,
        tableId: 'table-1',
        tableStatus: StudioTableStatusEnum.ACTIVE,
      };
      (mockStudioRepository.getStudioTableByTableID as jest.Mock).mockResolvedValue(mockStudio);

      const result = await service.getStudioTableByTableID('table-1');

      expect(mockStudioRepository.getStudioTableByTableID).toHaveBeenCalledWith('table-1');
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

  describe('getCaches', () => {
    it('should return data from cache if it exists', async () => {
      const mockCacheData = new Map<string, StudioTableOutput>();
      mockCacheData.set('table1', {
        tableId: 'table1',
        tableStatus: 'ACTIVE',
      } as StudioTableOutput);
      const mockCacheString = JSON.stringify([...mockCacheData]);

      (mockCacheService.get as jest.Mock).mockResolvedValue(mockCacheString);
      const spyGetStudioCache = jest.spyOn(mockStudioRepository, 'getStudioCache');
      const spySetCache = jest.spyOn(mockCacheService, 'set');

      const result = await service.getCaches();

      expect(mockCacheService.get).toHaveBeenCalledWith('studio');
      expect(spyGetStudioCache).not.toHaveBeenCalled();
      expect(spySetCache).not.toHaveBeenCalled();
      expect(result).toEqual(mockCacheData);
    });

    it('should fetch from repository and set cache if cache does not exist', async () => {
      (mockCacheService.get as jest.Mock).mockResolvedValue(null);

      const mockRepositoryData: StudioTableOutput[] = [
        {
          tableId: 'table1',
          tableStatus: 'ACTIVE',
        } as StudioTableOutput,
      ];
      (mockStudioRepository.getStudioCache as jest.Mock).mockResolvedValue(mockRepositoryData);

      const result = await service.getCaches();

      expect(mockCacheService.get).toHaveBeenCalledWith('studio');
      expect(mockStudioRepository.getStudioCache).toHaveBeenCalledTimes(1);

      const expectedMap = new Map();
      expectedMap.set('table1', mockRepositoryData[0]);

      const expectedCacheString = JSON.stringify([...expectedMap]);

      expect(mockCacheService.set).toHaveBeenCalledWith('studio', expectedCacheString, 86_400);

      expect(result).toEqual(expectedMap);
    });
  });

  describe('refreshCache', () => {
    it('should merge new data with existing cache and set it', async () => {
      const initialCacheData = new Map<string, StudioTableOutput>();
      initialCacheData.set('table1', {
        tableId: 'table1',
        tableStatus: 'INACTIVE',
      } as StudioTableOutput);
      const spyGetCaches = jest.spyOn(service, 'getCaches').mockResolvedValue(initialCacheData);

      const newCacheData: StudioTableOutput = {
        tableId: 'table1',
        tableStatus: 'ACTIVE',
      } as StudioTableOutput;

      await service.refreshCache(newCacheData);

      const expectedUpdatedMap = new Map(initialCacheData);
      expectedUpdatedMap.set('table1', newCacheData);

      const expectedCacheString = JSON.stringify([...expectedUpdatedMap]);

      expect(spyGetCaches).toHaveBeenCalledTimes(1);
      expect(mockCacheService.set).toHaveBeenCalledWith('studio', expectedCacheString, 86_400);
    });

    it('should filter undefined values during merge', async () => {
      const initialCacheData = new Map<string, StudioTableOutput>();
      initialCacheData.set('table1', {
        tableId: 'table1',
        tableStatus: 'INACTIVE',
        extraField: 'someValue',
      } as any);
      const spyGetCaches = jest.spyOn(service, 'getCaches').mockResolvedValue(initialCacheData);

      const newCacheData = {
        tableId: 'table1',
        tableStatus: 'ACTIVE',
        extraField: undefined,
      };

      await service.refreshCache(newCacheData as any);

      const expectedResult = { tableId: 'table1', tableStatus: 'ACTIVE', extraField: 'someValue' };
      const expectedMap = new Map();
      expectedMap.set('table1', expectedResult);
      const expectedCacheString = JSON.stringify([...expectedMap]);

      expect(mockCacheService.set).toHaveBeenCalledWith('studio', expectedCacheString, 86_400);
    });
  });

  describe('getStudioTable', () => {
    it('should return a list of table statuses from internal caches', async () => {
      const spyGetCaches = jest.spyOn(service, 'getCaches');
      const mockCacheMap = new Map<string, StudioTableOutput>();
      mockCacheMap.set('table1', {
        tableId: 'table1',
        tableStatus: 'ACTIVE',
      } as StudioTableOutput);
      spyGetCaches.mockResolvedValue(mockCacheMap);

      const request: GetStudioTableRequestType = {
        tableId: ['table1', 'table2'],
      };

      const result = await service.getStudioTable(request);

      expect(spyGetCaches).toHaveBeenCalledTimes(1);
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

      const spyRefreshCache = jest.spyOn(service, 'refreshCache').mockResolvedValue(undefined);
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

      expect(spyRefreshCache).toHaveBeenCalledWith(expectedOutput);
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

      const spyRefreshCache = jest.spyOn(service, 'refreshCache').mockResolvedValue(undefined);
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
      expect(spyRefreshCache).toHaveBeenCalledWith(expectedOutput);

      expect(result).toEqual(expectedOutput);
    });

    it('should throw StudioNotFoundError if no rows are updated', async () => {
      const request: UpdateStudioTableStatusRequestType = {
        tableId: 'non-existent',
        tableStatus: StudioTableStatusEnum.FAILURE,
      };
      const affectedRows = 0;

      const spyRefreshCache = jest.spyOn(service, 'refreshCache').mockResolvedValue(undefined);
      (mockStudioRepository.updateStudioTableStatus as jest.Mock).mockResolvedValue(affectedRows);

      await expect(service.updateStudioTableStatus(request)).rejects.toThrow(StudioNotFoundError);
      expect(spyRefreshCache).not.toHaveBeenCalled();
    });
  });
});
