/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable unicorn/no-useless-undefined */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { CacheService } from 'src/cache/cache.service';
import { DbService } from 'src/db/db.service';
import { StudioDevice } from 'src/studio/entities/studio-device.entity';
import { DbStudioDevice, UpdateStudioDeviceDataEntity } from './studio-device-data.repository.type';

import { StudioNotFoundError, StudioUpdateError } from 'src/studio/errors/studio.error';
import { UpdateResult } from 'typeorm';
import { StudioDeviceDataRepository } from './studio-device-data.repository';

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

const mockDbService = {
  getConnection: jest.fn(() => mockConnection),
} as unknown as DbService;

const mockCacheService = {
  hmGet: jest.fn(),
  hSet: jest.fn(),
} as unknown as CacheService;

describe('StudioDeviceDataRepository', () => {
  let repository: StudioDeviceDataRepository;

  beforeEach(() => {
    repository = new StudioDeviceDataRepository(mockCacheService, mockDbService);
    jest.clearAllMocks();
  });

  describe('onInit', () => {
    it('should be callable and return without errors', async () => {
      await expect(repository.onInit()).resolves.toBeUndefined();
    });
  });

  describe('getDeviceByID', () => {
    it('should return a studio object from cache', async () => {
      const mockStudio: DbStudioDevice = {
        deviceId: 'deviceId',
        tableId: 'tableId',
      };

      jest.spyOn(repository as any, 'getCache').mockResolvedValueOnce(mockStudio);

      const result = await repository.getDeviceByID('deviceId');
      expect(result).toBe(mockStudio);
    });

    it('should return a studio object from db if cache does not hit', async () => {
      const mockStudio: DbStudioDevice = {
        deviceId: 'deviceId',
        tableId: 'tableId',
      };

      jest.spyOn(repository as any, 'getCache').mockResolvedValueOnce(undefined);
      const spyRefreshCache = jest.spyOn(repository as any, 'refreshCache');

      (mockQueryBuilder.getRawOne as jest.Mock).mockResolvedValueOnce(mockStudio);

      const result = await repository.getDeviceByID('deviceId');
      expect(spyRefreshCache).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockStudio);
    });

    it('should throw error when both of cache and db does not hit', async () => {
      jest.spyOn(repository as any, 'getCache').mockResolvedValueOnce(undefined);

      (mockQueryBuilder.getRawOne as jest.Mock).mockResolvedValueOnce(undefined);

      await expect(repository.getDeviceByID('non-existent-table')).rejects.toThrow(
        StudioNotFoundError,
      );
    });
  });

  describe('insertDevice', () => {
    it('should insert a studio object and return the result', async () => {
      const mockResult: DbStudioDevice = {
        tableId: '',
        deviceId: 'deviceId',
      };

      const spyRefreshCache = jest.spyOn(repository as any, 'refreshCache');
      const result = await repository.insertDevice('deviceId');

      expect(mockDbService.getConnection).toHaveBeenCalledTimes(1);
      expect(mockQueryBuilder.insert).toHaveBeenCalledTimes(1);
      expect(mockQueryBuilder.into).toHaveBeenCalledWith(StudioDevice);
      expect(spyRefreshCache).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResult);
    });
  });

  describe('updateDevice', () => {
    it('should update the table status and return result', async () => {
      const updateEntity: UpdateStudioDeviceDataEntity = {
        deviceId: 'deviceId',
        tableId: 'tableId',
      };
      const mockUpdateResult: UpdateResult = {
        generatedMaps: [],
        raw: [{ TABLE_ID: 'tableId', DEVICE_ID: 'deviceId' }],
        affected: 1,
      };
      const mockRawResult: DbStudioDevice = {
        tableId: 'tableId',
        deviceId: 'deviceId',
      };

      const spyRefreshCache = jest.spyOn(repository as any, 'refreshCache');

      (mockQueryBuilder.execute as jest.Mock).mockResolvedValueOnce(mockUpdateResult);

      const result = await repository.updateDevice(updateEntity);

      expect(mockDbService.getConnection).toHaveBeenCalledTimes(1);
      expect(mockQueryBuilder.update).toHaveBeenCalledWith(StudioDevice);

      expect(spyRefreshCache).toHaveBeenCalledTimes(1);

      expect(result).toEqual(mockRawResult);
    });

    it('should throw error if no rows are affected', async () => {
      const updateEntity: UpdateStudioDeviceDataEntity = {
        deviceId: 'deviceId',
        tableId: 'uniTest',
      };
      const mockUpdateResult: UpdateResult = {
        generatedMaps: [],
        raw: [],
        affected: 0,
      };

      (mockQueryBuilder.execute as jest.Mock).mockResolvedValueOnce(mockUpdateResult);

      await expect(repository.updateDevice(updateEntity)).rejects.toThrow(StudioUpdateError);
    });
  });

  describe('getCacheKey', () => {
    it('should return cache key', async () => {
      expect((repository as any).getCacheKey()).toBe('studio-device');
    });
  });

  describe('getCache', () => {
    it('should return data from cache if it exists', async () => {
      const mockCacheData: DbStudioDevice = {
        tableId: 'table1',
        deviceId: 'device1',
      };

      (mockCacheService.hmGet as jest.Mock).mockResolvedValueOnce(['table1']);
      const result = await (repository as any).getCache('device1');
      expect(result).toEqual(mockCacheData);
    });

    it('should return undefined if db does not exist', async () => {
      (mockCacheService.hmGet as jest.Mock).mockResolvedValueOnce([]);

      const result = await (repository as any).getCache('device1');
      expect(result).toBeUndefined();
    });
  });

  describe('refreshCache', () => {
    it('should call setHash', async () => {
      await (repository as any).refreshCache({
        tableId: 'tableId',
        deviceId: 'deviceId',
      });
      expect(mockCacheService.hSet as jest.Mock).toHaveBeenCalledTimes(1);
    });
  });
});
