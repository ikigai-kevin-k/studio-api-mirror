// studio.service.spec.ts
/* eslint-disable unicorn/no-null */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable unicorn/no-useless-undefined */
import { LoggerService } from '@ikigaians/logger';
import { CacheService } from 'src/cache/cache.service';
import { UNKNOWN_GAME_CODE } from 'src/studio/const/studio.const';
import {
  GetStudioTableRequestType,
  InsertStudioTableRequestType,
  UpdateStudioTableStatusRequestType,
} from 'src/studio/controller/v1/studio/studio.type';
import { StudioTableStatusEnum } from 'src/studio/enums/studio.enums';
import { StudioNotFoundError } from 'src/studio/errors/studio.error';
import { StudioRepository } from 'src/studio/repositories/studio/studio.repository';
import { StudioTableResult } from 'src/studio/repositories/studio/studio.repository.type';
import { StudioService } from 'src/studio/services/studio/studio.service';
import { schema, StudioServiceOutput } from 'src/studio/services/studio/studio.service.type';

const mockStudioRepository = {
  getStudioTableByTableID: jest.fn(),
  getStudio: jest.fn(),
  insertStudioTable: jest.fn(),
  updateStudioTable: jest.fn(),
} as unknown as StudioRepository;

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

describe('StudioService', () => {
  let service: StudioService;

  beforeEach(() => {
    service = new StudioService(mockStudioRepository, mockCacheService, mockLoggerService);
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
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
        gameId: 'game1',
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
        gameId: 'game1',
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
        gameId: 'game1',
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
          gameId: 'game1',
        },
      ]);
    });
  });

  describe('insertStudioTable', () => {
    it('should insert a new studio and refresh the cache (tableId Only)', async () => {
      const request: InsertStudioTableRequestType = {
        tableId: 'table-new',
      };

      const mockRepoResult: StudioTableResult = {
        tableId: 'table-new',
        tableStatus: StudioTableStatusEnum.FAILURE,
        gameId: UNKNOWN_GAME_CODE,
      };

      (mockStudioRepository.insertStudioTable as jest.Mock).mockResolvedValue(mockRepoResult);

      const result = await service.insertStudioTable(request);

      expect(mockStudioRepository.insertStudioTable).toHaveBeenCalledWith(
        expect.objectContaining({
          tableId: request.tableId,
          tableStatus: StudioTableStatusEnum.FAILURE,
          gameId: UNKNOWN_GAME_CODE,
        }),
      );

      expect(result).toEqual(mockRepoResult);
    });

    it('should insert a new studio and refresh the cache', async () => {
      const request: InsertStudioTableRequestType = {
        tableId: 'table-new',
        tableStatus: StudioTableStatusEnum.ACTIVE,
        gameId: 'ARO-001',
      };

      const mockRepoResult: StudioTableResult = {
        tableId: 'table-new',
        tableStatus: StudioTableStatusEnum.ACTIVE,
        gameId: 'ARO-001',
      };

      (mockStudioRepository.insertStudioTable as jest.Mock).mockResolvedValue(mockRepoResult);

      const result = await service.insertStudioTable(request);

      expect(mockStudioRepository.insertStudioTable).toHaveBeenCalledWith(
        expect.objectContaining({
          tableId: request.tableId,
          tableStatus: StudioTableStatusEnum.ACTIVE,
          gameId: 'ARO-001',
        }),
      );

      expect(result).toEqual(mockRepoResult);
    });
  });

  describe('updateStudioTableStatus', () => {
    it('should update studio status and refresh the cache', async () => {
      const request: UpdateStudioTableStatusRequestType = {
        tableId: 'table-1',
        tableStatus: StudioTableStatusEnum.FAILURE,
      };
      const affectedRows = 1;

      (mockStudioRepository.updateStudioTable as jest.Mock).mockResolvedValue(affectedRows);

      const result = await service.updateStudioTable(request);

      expect(mockStudioRepository.updateStudioTable).toHaveBeenCalledWith(
        request.tableId,
        expect.objectContaining({
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

      (mockStudioRepository.updateStudioTable as jest.Mock).mockResolvedValue(undefined);

      await expect(service.updateStudioTable(request)).rejects.toThrow(StudioNotFoundError);
    });
  });

  describe('setStudioTableStatus', () => {
    it('should update studio status and refresh the cache', async () => {
      const mockResult: StudioTableResult = {
        tableId: 'table-1',
        tableStatus: StudioTableStatusEnum.FAILURE,
        gameId: 'gameId',
      };

      (mockStudioRepository.updateStudioTable as jest.Mock).mockResolvedValue(mockResult);

      const result = await service.setStudioTableStatus('tableId', StudioTableStatusEnum.FAILURE);

      expect(mockStudioRepository.updateStudioTable).toHaveBeenCalledWith(
        'tableId',
        expect.objectContaining({
          tableStatus: StudioTableStatusEnum.FAILURE,
        }),
      );

      expect(result).toEqual(true);
    });

    it('should return false if no rows are updated', async () => {
      (mockStudioRepository.updateStudioTable as jest.Mock).mockResolvedValue(undefined);

      const result = await service.setStudioTableStatus('tableId', StudioTableStatusEnum.FAILURE);

      expect(mockStudioRepository.updateStudioTable).toHaveBeenCalledWith(
        'tableId',
        expect.objectContaining({
          tableStatus: StudioTableStatusEnum.FAILURE,
        }),
      );

      expect(result).toEqual(false);
    });
  });

  describe('getStudioTableBelongTo', () => {
    it('should return data from cache', async () => {
      const mockResult: StudioTableResult = {
        tableId: 'table-1',
        tableStatus: StudioTableStatusEnum.FAILURE,
        gameId: 'gameId',
      };

      const spyGetCache = jest.spyOn(service, 'getCache');
      spyGetCache.mockResolvedValue(mockResult);

      const result = await service.getStudioTableBelongTo('table-1');
      expect(result).toEqual('gameId');
    });

    it('should return undefined if cache does not hit', async () => {
      const spyGetCache = jest.spyOn(service, 'getCache');
      spyGetCache.mockResolvedValue(undefined);

      const result = await service.getStudioTableBelongTo('table-1');
      expect(result).toBeUndefined();
    });
  });
});
