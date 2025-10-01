// studio.repository.spec.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable unicorn/no-useless-undefined */
import { CacheService } from 'src/cache/cache.service';
import { DbService } from 'src/db/db.service';
import { StudioNotFoundError, StudioUpdateError } from 'src/studio/errors/studio.error';
import { UpdateResult } from 'typeorm';
import { Studio } from '../../entities/studio.entity';
import { StudioTableStatusEnum } from '../../enums/studio.enums';
import { StudioRepository } from './studio.repository';
import { DbStudio, UpdateStudioTableStatusEntity } from './studio.repository.type';

const mockQueryBuilder = {
  select: jest.fn().mockReturnThis(),
  from: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  into: jest.fn().mockReturnThis(),
  values: jest.fn().mockReturnThis(),
  returning: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  set: jest.fn().mockReturnThis(),
  setParameters: jest.fn().mockReturnThis(),
  execute: jest.fn(),
  getOne: jest.fn(),
  getMany: jest.fn(),
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
  getHashAs: jest.fn(),
  setHash: jest.fn(),
} as unknown as CacheService;

const mockDbService = {
  getConnection: jest.fn(() => mockConnection),
} as unknown as DbService;

describe('StudioRepository', () => {
  let repository: StudioRepository;

  beforeEach(() => {
    repository = new StudioRepository(mockCacheService, mockDbService);
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

  describe('getStudioTableByTableID', () => {
    it('should return a DbStudio object when hit cache', async () => {
      const mockStudio: DbStudio = {
        tableId: 'tableId',
        tableStatus: StudioTableStatusEnum.INACTIVE,
        gameId: 'gameId',
      };

      jest.spyOn(repository as any, 'getCache').mockResolvedValueOnce(mockStudio);

      const result = await repository.getStudioTableByTableID('tableId');
      expect(result).toBe(mockStudio);
    });

    it('should return a DbStudio object when does not hit cache but query from db', async () => {
      const mockStudio: DbStudio = {
        tableId: 'tableId',
        tableStatus: StudioTableStatusEnum.INACTIVE,
        gameId: 'gameId',
      };

      const spyRefreshCache = jest.spyOn(repository as any, 'refreshCache');
      jest.spyOn(repository as any, 'getCache').mockResolvedValueOnce(undefined);

      (mockQueryBuilder.getRawOne as jest.Mock).mockResolvedValueOnce(mockStudio);

      const result = await repository.getStudioTableByTableID('tableId');
      expect(spyRefreshCache).toHaveBeenCalledTimes(1);
      expect(result).toBe(mockStudio);
    });

    it('should throw error when does not hit both of cache and db', async () => {
      jest.spyOn(repository as any, 'getCache').mockResolvedValueOnce(undefined);
      (mockQueryBuilder.getRawOne as jest.Mock).mockResolvedValueOnce(undefined);

      await expect(repository.getStudioTableByTableID('tableId')).rejects.toThrow(
        StudioNotFoundError,
      );
    });
  });

  describe('insertStudioTable', () => {
    it('should insert or update a studio and return the result', async () => {
      const spyRefreshCache = jest.spyOn(repository as any, 'refreshCache');
      const result = await repository.insertStudioTable('tableId');

      expect(mockDbService.getConnection).toHaveBeenCalledTimes(1);
      expect(mockQueryBuilder.insert).toHaveBeenCalledTimes(1);
      expect(spyRefreshCache).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        tableId: 'tableId',
        tableStatus: StudioTableStatusEnum.INITIAL,
      });
    });
  });

  describe('updateStudioTable', () => {
    it('should update the table status and return a DbStudio object', async () => {
      const updateEntity: UpdateStudioTableStatusEntity = {
        tableId: 'tableId',
        tableStatus: StudioTableStatusEnum.INACTIVE,
      };
      const mockUpdateResult: UpdateResult = {
        generatedMaps: [],
        raw: [
          { TABLE_ID: 'tableId', TABLE_STATUS: StudioTableStatusEnum.INACTIVE, GAME_ID: 'game1' },
        ],
        affected: 1,
      };
      const mockRawResult: DbStudio = {
        tableId: 'tableId',
        tableStatus: StudioTableStatusEnum.INACTIVE,
        gameId: 'game1',
      };

      (mockQueryBuilder.execute as jest.Mock).mockResolvedValueOnce(mockUpdateResult);

      const result = await repository.updateStudioTable(updateEntity);

      expect(mockDbService.getConnection).toHaveBeenCalledTimes(1);
      expect(mockQueryBuilder.update).toHaveBeenCalledWith(Studio);
      expect(result).toEqual(mockRawResult);
    });

    it('should return undefined if no rows are affected', async () => {
      const updateEntity: UpdateStudioTableStatusEntity = {
        tableId: 'tableId',
        tableStatus: StudioTableStatusEnum.INACTIVE,
      };
      const mockUpdateResult: UpdateResult = {
        generatedMaps: [],
        raw: [],
        affected: 0,
      };

      (mockQueryBuilder.execute as jest.Mock).mockResolvedValueOnce(mockUpdateResult);

      await expect(repository.updateStudioTable(updateEntity)).rejects.toThrow(StudioUpdateError);
    });
  });

  describe('getCacheKey', () => {
    it('should return cache key', async () => {
      expect((repository as any).getCacheKey('gameCode')).toBe('studio-gameCode');
    });
  });

  describe('getCache', () => {
    it('should return data from cache if it exists', async () => {
      const mockCacheData: DbStudio = {
        tableId: 'table1',
        tableStatus: StudioTableStatusEnum.INITIAL,
        gameId: 'game1',
      };

      (mockCacheService.getHashAs as jest.Mock).mockResolvedValueOnce(mockCacheData);
      const result = await (repository as any).getCache('table1');
      expect(result).toBe(mockCacheData);
    });

    it('should return undefined if db does not exist', async () => {
      (mockCacheService.getHashAs as jest.Mock).mockResolvedValueOnce(undefined);

      const result = await (repository as any).getCache('table1');
      expect(result).toBeUndefined();
    });
  });

  describe('refreshCache', () => {
    it('should call setHash', async () => {
      await (repository as any).refreshCache({
        tableId: 'tableId',
        tableStatus: StudioTableStatusEnum.INACTIVE,
        gameId: 'game1',
      });
      expect(mockCacheService.setHash as jest.Mock).toHaveBeenCalledTimes(1);
    });
  });
});
