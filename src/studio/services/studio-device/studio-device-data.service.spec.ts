// studio.service.spec.ts
/* eslint-disable unicorn/no-null */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable unicorn/no-useless-undefined */
import { LoggerService } from '@ikigaians/logger';
import { CacheService } from 'src/cache/cache.service';
import { UNKNOWN_TABLE_CODE } from 'src/studio/const/studio.const';
import {
  GetDeviceRequestType,
  InsertDeviceRequestType,
  UpdateDeviceRequestType,
} from 'src/studio/controller/v1/studio-device/studio-device.type';
import { StudioNotFoundError } from 'src/studio/errors/studio.error';
import { StudioDeviceDataRepository } from 'src/studio/repositories/studio-device/studio-device-data.repository';
import { StudioDeviceDataResult } from 'src/studio/repositories/studio-device/studio-device-data.repository.type';
import { StudioDeviceDataService } from './studio-device-data.service';

const mockStudioDeviceDataRepository = {
  getDeviceByID: jest.fn(),
  insertDevice: jest.fn(),
  updateDevice: jest.fn(),
} as unknown as StudioDeviceDataRepository;

const mockCacheService = {
  getHashAs: jest.fn(),
  setHash: jest.fn(),
  refresh: jest.fn(),
  hSet: jest.fn(),
  hmGet: jest.fn(),
  has: jest.fn(),
} as unknown as CacheService;

const mockLoggerService = {
  info: jest.fn(),
  error: jest.fn(),
} as unknown as LoggerService;

describe('StudioDeviceDataService', () => {
  let service: StudioDeviceDataService;

  beforeEach(() => {
    service = new StudioDeviceDataService(
      mockStudioDeviceDataRepository,
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
      expect((service as any).getCacheKey()).toBe('studio-device');
    });
  });

  describe('getCache', () => {
    it('should return data from cache if it exists', async () => {
      const mockCacheData: string[] = ['tableId'];

      (mockCacheService.hmGet as jest.Mock).mockResolvedValue(mockCacheData);
      const spyGetStudio = jest.spyOn(mockStudioDeviceDataRepository, 'getDeviceByID');
      const spySetCache = jest.spyOn(mockCacheService, 'hSet');

      const result = await (service as any).getCache('deviceId');

      expect(mockCacheService.hmGet).toHaveBeenCalledWith('studio-device', ['deviceId']);
      expect(spyGetStudio).not.toHaveBeenCalled();
      expect(spySetCache).not.toHaveBeenCalled();
      expect(result).toEqual('tableId');
    });

    it('should fetch from repository and set cache if cache does not exist', async () => {
      (mockCacheService.hmGet as jest.Mock).mockResolvedValue(['']);

      const mockRepositoryData: string = 'tableId';
      (mockStudioDeviceDataRepository.getDeviceByID as jest.Mock).mockResolvedValue({
        deviceId: 'deviceId',
        tableId: 'tableId',
      });

      const result = await (service as any).getCache('deviceId');

      expect(mockCacheService.hmGet).toHaveBeenCalledWith('studio-device', ['deviceId']);
      expect(mockStudioDeviceDataRepository.getDeviceByID).toHaveBeenCalledWith('deviceId');

      expect(mockCacheService.hSet).toHaveBeenCalledWith(
        'studio-device',
        new Map([['deviceId', 'tableId']]),
      );

      expect(result).toEqual(mockRepositoryData);
    });

    it('should return undefined if db does not exist', async () => {
      (mockCacheService.hmGet as jest.Mock).mockResolvedValue(['']);

      (mockStudioDeviceDataRepository.getDeviceByID as jest.Mock).mockResolvedValue(undefined);

      const result = await (service as any).getCache('deviceId');

      expect(mockCacheService.hmGet).toHaveBeenCalledWith('studio-device', ['deviceId']);
      expect(mockStudioDeviceDataRepository.getDeviceByID).toHaveBeenCalledWith('deviceId');

      expect(mockCacheService.hSet).toHaveBeenCalledTimes(0);

      expect(result).toBeUndefined();
    });
  });

  describe('getDevice', () => {
    it('should return a data from cache', async () => {
      const request: GetDeviceRequestType = {
        deviceId: 'deviceId',
      };

      const spyGetCaches = jest.spyOn(service as any, 'getCache');
      spyGetCaches.mockResolvedValueOnce('tableId');

      const result = await service.getDevice(request);
      expect(result).toEqual({
        deviceId: 'deviceId',
        tableId: 'tableId',
      });
    });

    it('should throw an error when no data', async () => {
      const request: GetDeviceRequestType = {
        deviceId: 'deviceId',
      };

      const spyGetCaches = jest.spyOn(service as any, 'getCache');
      spyGetCaches.mockResolvedValueOnce('');

      await expect(service.getDevice(request)).rejects.toThrow();
    });
  });

  describe('insertDevice', () => {
    it('should insert a new studio and refresh the cache (deviceId Only)', async () => {
      const request: InsertDeviceRequestType = {
        deviceId: 'deviceId',
      };

      const mockRepoResult: StudioDeviceDataResult = {
        deviceId: 'deviceId',
        tableId: UNKNOWN_TABLE_CODE,
      };

      (mockStudioDeviceDataRepository.insertDevice as jest.Mock).mockResolvedValue(mockRepoResult);

      const result = await service.insertDevice(request);

      expect(mockStudioDeviceDataRepository.insertDevice).toHaveBeenCalledWith(
        expect.objectContaining({
          deviceId: 'deviceId',
          tableId: UNKNOWN_TABLE_CODE,
        }),
      );

      expect(result).toEqual(mockRepoResult);
    });

    it('should insert a new studio and refresh the cache', async () => {
      const request: InsertDeviceRequestType = {
        deviceId: 'deviceId',
        tableId: 'tableId',
      };

      const mockRepoResult: StudioDeviceDataResult = {
        deviceId: 'deviceId',
        tableId: 'tableId',
      };

      (mockStudioDeviceDataRepository.insertDevice as jest.Mock).mockResolvedValue(mockRepoResult);

      const result = await service.insertDevice(request);

      expect(mockStudioDeviceDataRepository.insertDevice).toHaveBeenCalledWith(
        expect.objectContaining({
          deviceId: 'deviceId',
          tableId: 'tableId',
        }),
      );

      expect(result).toEqual(mockRepoResult);
    });
  });

  describe('updateStudioTableStatus', () => {
    it('should update studio status and refresh the cache', async () => {
      const request: UpdateDeviceRequestType = {
        tableId: 'tableId',
        deviceId: 'deviceId',
      };

      const mockRepoResult: StudioDeviceDataResult = {
        tableId: 'tableId',
        deviceId: 'deviceId',
      };

      (mockStudioDeviceDataRepository.updateDevice as jest.Mock).mockResolvedValue(mockRepoResult);

      const result = await service.updateDevice(request);

      expect(mockStudioDeviceDataRepository.updateDevice).toHaveBeenCalledWith(
        expect.objectContaining({
          tableId: 'tableId',
          deviceId: 'deviceId',
        }),
      );

      const expectedOutput = {
        tableId: 'tableId',
        deviceId: 'deviceId',
      };

      expect(result).toEqual(expectedOutput);
    });

    it('should throw StudioNotFoundError if no rows are updated', async () => {
      const request: UpdateDeviceRequestType = {
        tableId: 'tableId',
        deviceId: 'deviceId',
      };

      (mockStudioDeviceDataRepository.updateDevice as jest.Mock).mockResolvedValue(undefined);

      await expect(service.updateDevice(request)).rejects.toThrow(StudioNotFoundError);
    });
  });

  describe('getDeviceBelongTo', () => {
    it('should return data from the cache', async () => {
      const spyGetCaches = jest.spyOn(service as any, 'getCache');
      spyGetCaches.mockResolvedValueOnce('tableId');

      const result = await service.getDeviceBelongTo('device');

      expect(result).toEqual('tableId');
    });
  });
});
