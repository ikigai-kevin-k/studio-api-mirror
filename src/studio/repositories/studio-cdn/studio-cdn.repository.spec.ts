// studio-cdn.repository.spec.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable unicorn/no-null */
/* eslint-disable unicorn/no-useless-undefined */
import { CacheService } from 'src/cache/cache.service';
import { DbService } from 'src/db/db.service';
import { StudioNotFoundError, StudioUpdateError } from 'src/studio/errors/studio.error';
import { StudioCdnRepository } from './studio-cdn.repository';
import { DbStudioCdnResult, StudioCdnEntity } from './studio-cdn.repository.type';

const mockQueryBuilder = {
  select: jest.fn().mockReturnThis(),
  from: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  into: jest.fn().mockReturnThis(),
  values: jest.fn().mockReturnThis(),
  returning: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  set: jest.fn().mockReturnThis(),
  execute: jest.fn(),
  getOne: jest.fn(),
  getRawOne: jest.fn(),
  getRawMany: jest.fn(),
};

const mockRepository = {
  createQueryBuilder: jest.fn(() => mockQueryBuilder),
};

const mockConnection = {
  getRepository: jest.fn(() => mockRepository),
  createQueryBuilder: jest.fn(() => mockQueryBuilder),
};

const mockCacheService = {
  setHash: jest.fn(),
  getHashAs: jest.fn(),
} as unknown as CacheService;

const mockDbService = {
  getConnection: jest.fn(() => mockConnection),
} as unknown as DbService;

describe('StudioCdnRepository', () => {
  let repository: StudioCdnRepository;

  beforeEach(() => {
    repository = new StudioCdnRepository(mockCacheService, mockDbService);
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('onInit', () => {
    it('should be callable and return without errors', async () => {
      await expect(repository.onInit()).resolves.toBeUndefined();
    });
  });

  describe('getTableCdnByTableID', () => {
    it('should return a studio object from cache', async () => {
      const tableId = 'tableCode';
      const mockStudio: DbStudioCdnResult = {
        tableId: tableId,
        cdnDst: {},
      };

      const spyGetCache = jest.spyOn(repository as any, 'getCache');
      spyGetCache.mockResolvedValueOnce(mockStudio);

      const result = await repository.getTableCdnByTableID(tableId);
      expect(result).toBe(mockStudio);
      expect(mockQueryBuilder.getRawOne).not.toHaveBeenCalled();
    });

    it('should return a studio object from db if cache does not hit', async () => {
      const tableId = 'tableCode';
      const mockStudio: DbStudioCdnResult = {
        tableId: tableId,
        cdnDst: {},
      };

      const spyGetCache = jest.spyOn(repository as any, 'getCache');
      spyGetCache.mockResolvedValueOnce(undefined);

      const spyRefreshCache = jest.spyOn(repository as any, 'refreshCache');

      (mockQueryBuilder.getRawOne as jest.Mock).mockResolvedValueOnce(mockStudio);

      const result = await repository.getTableCdnByTableID(tableId);
      expect(result).toBe(mockStudio);
      expect(spyRefreshCache).toHaveBeenCalledWith(tableId, mockStudio);
    });

    it('should throw an error if does not find anything', async () => {
      const tableId = 'tableCode';
      const spyGetCache = jest.spyOn(repository as any, 'getCache');
      spyGetCache.mockResolvedValueOnce(undefined);

      (mockQueryBuilder.getRawOne as jest.Mock).mockResolvedValueOnce(undefined);

      await expect(repository.getTableCdnByTableID(tableId)).rejects.toThrow(StudioNotFoundError);
    });
  });

  describe('insertTableCdn', () => {
    it('should return a game object from db', async () => {
      const tableId = 'tableCode';
      const mockEntity: StudioCdnEntity = {
        tableId: tableId,
        cdnDst: {},
      };
      const mockResult = {
        affected: 1,
        raw: [
          {
            TABLE_ID: tableId,
            CDN: {},
          },
        ],
      };

      const spyRefreshCache = jest.spyOn(repository as any, 'refreshCache');

      (mockQueryBuilder.execute as jest.Mock).mockResolvedValueOnce(mockResult);

      const result = await repository.insertTableCdn(mockEntity);
      expect(result).toEqual({
        tableId: tableId,
        cdnDst: {},
      });

      expect(spyRefreshCache).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateTableCdn', () => {
    it('should update a studio object to db', async () => {
      const tableId = 'tableCode';
      const mockUpdateEntity: StudioCdnEntity = {
        tableId: tableId,
        cdnDst: {},
      };
      const mockUpdateResult = {
        affected: 1,
        raw: [
          {
            TABLE_ID: tableId,
            CDN: {},
          },
        ],
      };

      (mockQueryBuilder.execute as jest.Mock).mockResolvedValueOnce(mockUpdateResult);

      const result = await repository.updateTableCdn(mockUpdateEntity);
      expect(result).toEqual({
        tableId: tableId,
        cdnDst: {},
      });
    });

    it('should throw an error if none modified', async () => {
      const tableId = 'tableCode';
      const mockUpdateEntity: StudioCdnEntity = {
        tableId: tableId,
        cdnDst: {},
      };
      const mockUpdateResult = {
        raw: [],
        affected: 0,
      };

      (mockQueryBuilder.execute as jest.Mock).mockResolvedValueOnce(mockUpdateResult);

      await expect(repository.updateTableCdn(mockUpdateEntity)).rejects.toThrow(StudioUpdateError);
    });
  });

  describe('getCacheKey', () => {
    it('should return a key', async () => {
      expect((repository as any).getCacheKey('ARO-001')).toEqual('studio-cdn-ARO-001');
    });
  });

  describe('getCache', () => {
    it('should return data from cache', async () => {
      const tableId = 'gameCode';
      const mockStudio: DbStudioCdnResult = {
        tableId: tableId,
        cdnDst: {},
      };
      (mockCacheService.getHashAs as jest.Mock).mockResolvedValueOnce(mockStudio);
      const result = await (repository as any).getCache(tableId);
      expect(result).toBe(mockStudio);
    });
  });

  describe('refreshCache', () => {
    it('should call cacheService.setHash', async () => {
      const tableId = 'gameCode';
      const mockStudio: DbStudioCdnResult = {
        tableId: tableId,
        cdnDst: {},
      };
      await (repository as any).refreshCache(tableId, mockStudio);
      expect(mockCacheService.setHash).toHaveBeenCalledWith(`studio-cdn-${tableId}`, mockStudio);
    });
  });
});
