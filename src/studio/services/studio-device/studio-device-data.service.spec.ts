/* eslint-disable unicorn/no-null */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable unicorn/no-useless-undefined */
import { LoggerService } from '@ikigaians/logger';
import { CacheService } from 'src/cache/cache.service';
import { StudioDeviceDataRepository } from 'src/studio/repositories/studio-device/studio-device-data.repository';
import { StudioDeviceDataService } from './studio-device-data.service';
import {
  DeviceDataServiceOutput,
  GetDeviceDataServiceInput,
  InsertDeviceDataServiceInput,
  UpdateDeviceDataServiceInput,
} from './studio-device-data.service.type';

const mockStudioDeviceDataRepository = {
  getDeviceByDeviceID: jest.fn(),
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
    service = new StudioDeviceDataService(mockStudioDeviceDataRepository, mockLoggerService);
    jest.clearAllMocks();
  });

  describe('onInit', () => {
    it('should be callable and return without errors', async () => {
      await expect(service.onInit()).resolves.toBeUndefined();
    });
  });

  describe('getDevice', () => {
    it('should return a data from cache', async () => {
      const input: GetDeviceDataServiceInput = {
        deviceId: 'deviceId',
      };

      const output: DeviceDataServiceOutput = {
        deviceId: 'deviceId',
        tableId: 'tableId',
      };

      (mockStudioDeviceDataRepository.getDeviceByDeviceID as jest.Mock).mockResolvedValueOnce(
        output,
      );

      const result = await service.getDevice(input);
      expect(result).toBe(output);
    });
  });

  describe('insertDevice', () => {
    it('should insert a new studio', async () => {
      const input: InsertDeviceDataServiceInput = {
        deviceId: 'deviceId',
      };

      const output: DeviceDataServiceOutput = {
        deviceId: 'deviceId',
        tableId: 'tableId',
      };

      (mockStudioDeviceDataRepository.insertDevice as jest.Mock).mockResolvedValueOnce(output);

      const result = await service.insertDevice(input);
      expect(result).toBe(output);
    });
  });

  describe('updateDevice', () => {
    it('should update a studio entity', async () => {
      const input: UpdateDeviceDataServiceInput = {
        tableId: 'tableId',
        deviceId: 'deviceId',
      };

      const output: DeviceDataServiceOutput = {
        tableId: 'tableId',
        deviceId: 'deviceId',
      };

      (mockStudioDeviceDataRepository.updateDevice as jest.Mock).mockResolvedValueOnce(output);

      const result = await service.updateDevice(input);

      expect(result).toBe(output);
    });
  });

  describe('getDeviceBelongTo', () => {
    it('should return data from the cache', async () => {
      const mockResult = {
        tableId: 'tableId',
        deviceId: 'deviceId',
      };

      (mockStudioDeviceDataRepository.getDeviceByDeviceID as jest.Mock).mockResolvedValueOnce(
        mockResult,
      );

      const result = await service.getDeviceBelongTo('deviceId');

      expect(result).toEqual('tableId');
    });
  });
});
