// studio.repository.spec.ts
/* eslint-disable unicorn/no-null */
import { DbService } from 'src/db/db.service';
import { StudioDevice } from 'src/studio/entities/studio-device.entity';
import {
  StudioDeviceDataResult,
  UpdateStudioDeviceDataEntity,
} from './studio-device-data.repository.type';
import { StudioDeviceSchema } from './studio-device.repository.type';

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

describe('StudioDeviceDataRepository', () => {
  let repository: StudioDeviceDataRepository;

  beforeEach(() => {
    repository = new StudioDeviceDataRepository(mockDbService);
    jest.clearAllMocks();
  });

  describe('onInit', () => {
    it('should be callable and return without errors', async () => {
      await expect(repository.onInit()).resolves.toBeUndefined();
    });
  });

  describe('getDeviceByID', () => {
    it('should return a studio object when found', async () => {
      const mockStudio: StudioDeviceDataResult = {
        deviceId: 'deviceId',
        tableId: 'uniTest',
      };

      (mockQueryBuilder.getRawOne as jest.Mock).mockResolvedValue(mockStudio);

      const result = await repository.getDeviceByID('deviceId');

      expect(mockDbService.getConnection).toHaveBeenCalledTimes(1);

      expect(mockConnection.getRepository).toHaveBeenCalledWith(StudioDevice);
      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('studio');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('studio.DEVICE_ID = :deviceID', {
        deviceID: 'deviceId',
      });
      expect(mockQueryBuilder.getRawOne).toHaveBeenCalledTimes(1);

      expect(result).toEqual(mockStudio);
    });

    it('should return null when no studio is found', async () => {
      (mockQueryBuilder.getRawOne as jest.Mock).mockResolvedValue(null);

      const result = await repository.getDeviceByID('non-existent-table');

      expect(mockDbService.getConnection).toHaveBeenCalledTimes(1);
      expect(mockConnection.getRepository).toHaveBeenCalledWith(StudioDevice);
      expect(mockRepository.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(mockQueryBuilder.getRawOne).toHaveBeenCalledTimes(1);

      expect(result).toBeNull();
    });
  });

  describe('insertStudio', () => {
    it('should insert or update a studio and return the result', async () => {
      const mockStudio: StudioDevice = {
        id: 1,
        deviceId: 'deviceId',
        tableId: 'uniTest',
      };
      const mockRawResult: StudioDeviceSchema = {
        TABLE_ID: 'uniTest',
        DEVICE_ID: 'deviceId',
      };
      const mockExecuteResult = { raw: [mockRawResult] };
      const mockResult: StudioDeviceDataResult = {
        tableId: 'uniTest',
        deviceId: 'deviceId',
      };

      (mockQueryBuilder.execute as jest.Mock).mockResolvedValue(mockExecuteResult);

      const result = await repository.insertDevice(mockStudio);

      expect(mockDbService.getConnection).toHaveBeenCalledTimes(1);
      expect(mockQueryBuilder.insert).toHaveBeenCalledTimes(1);
      expect(mockQueryBuilder.into).toHaveBeenCalledWith(StudioDevice);
      expect(mockQueryBuilder.values).toHaveBeenCalledWith(mockStudio);
      expect(mockQueryBuilder.returning).toHaveBeenCalledWith('*');
      expect(result).toEqual(mockResult);
    });
  });

  describe('updateDevice', () => {
    it('should update the table status and return affected rows count', async () => {
      const updateEntity: UpdateStudioDeviceDataEntity = {
        deviceId: 'deviceId',
        tableId: 'uniTest',
      };
      const mockUpdateResult: UpdateResult = {
        generatedMaps: [],
        raw: [{ TABLE_ID: 'uniTest', DEVICE_ID: 'deviceId' }],
        affected: 1,
      };
      const mockRawResult: StudioDeviceDataResult = {
        tableId: 'uniTest',
        deviceId: 'deviceId',
      };

      (mockQueryBuilder.execute as jest.Mock).mockResolvedValue(mockUpdateResult);

      const result = await repository.updateDevice(updateEntity);

      expect(mockDbService.getConnection).toHaveBeenCalledTimes(1);
      expect(mockQueryBuilder.update).toHaveBeenCalledWith(StudioDevice);
      expect(mockQueryBuilder.set).toHaveBeenCalledWith({
        tableId: updateEntity.tableId,
      });
      expect(mockQueryBuilder.returning).toHaveBeenCalledWith('*');
      expect(result).toEqual(mockRawResult);
    });

    it('should return undefined if no rows are affected', async () => {
      const updateEntity: UpdateStudioDeviceDataEntity = {
        deviceId: 'deviceId',
        tableId: 'uniTest',
      };
      const mockUpdateResult: UpdateResult = {
        generatedMaps: [],
        raw: [],
        affected: 0,
      };

      (mockQueryBuilder.execute as jest.Mock).mockResolvedValue(mockUpdateResult);

      const result = await repository.updateDevice(updateEntity);

      expect(result).toBeUndefined();
    });
  });
});
