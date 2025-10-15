/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable unicorn/no-useless-undefined */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { DbService } from 'src/db/db.service';
import { StudioNotFoundError, StudioUpdateError } from 'src/studio/errors/studio.error';
import { StudioErrorSignalLogRepository } from './studio-error-signal-log.repository';
import { DbStudioErrorSignalLog } from './studio-error-signal-log.repository.type';

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
  limit: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
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

describe('StudioErrorSignalLogRepository', () => {
  let repository: StudioErrorSignalLogRepository;

  beforeEach(() => {
    repository = new StudioErrorSignalLogRepository(mockDbService);
    jest.clearAllMocks();
  });

  describe('onInit', () => {
    it('should be callable and return without errors', async () => {
      await expect(repository.onInit()).resolves.toBeUndefined();
    });
  });

  describe('getErrorSignalLogById', () => {
    it('should return a studio object from db', async () => {
      const currentTime = new Date();
      const mockStudio: DbStudioErrorSignalLog = {
        id: 1,
        deviceId: 'deviceId',
        errorSignal: { msgId: '', metadata: {} },
        resolved: false,
        createdAt: currentTime,
        updatedAt: currentTime,
      };

      (mockQueryBuilder.getRawOne as jest.Mock).mockResolvedValueOnce(mockStudio);

      const result = await repository.getErrorSignalLogById(1);
      expect(result).toBe(mockStudio);
    });

    it('should throw an error if does not find anything', async () => {
      (mockQueryBuilder.getRawOne as jest.Mock).mockResolvedValueOnce(undefined);

      await expect(repository.getErrorSignalLogById(1)).rejects.toThrow(StudioNotFoundError);
    });
  });

  describe('getUnResolvedErrorSignalLogByDeviceId', () => {
    it('should return a studio object from db', async () => {
      const currentTime = new Date();
      const mockStudio: DbStudioErrorSignalLog = {
        id: 1,
        deviceId: 'deviceId',
        errorSignal: { msgId: '', metadata: {} },
        resolved: false,
        createdAt: currentTime,
        updatedAt: currentTime,
      };

      (mockQueryBuilder.getRawOne as jest.Mock).mockResolvedValueOnce(mockStudio);

      const result = await repository.getUnResolvedErrorSignalLogByDeviceId('deviceId');
      expect(result).toBe(mockStudio);

      expect(mockQueryBuilder.where).toHaveBeenCalledWith('studio.DEVICE_ID = :deviceID', {
        deviceID: 'deviceId',
      });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('studio.RESOLVED = :resolved', {
        resolved: false,
      });
      expect(mockQueryBuilder.limit).toHaveBeenCalledWith(1);
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('studio.CREATED_AT', 'DESC');
    });

    it('should throw an error if does not find anything', async () => {
      (mockQueryBuilder.getRawOne as jest.Mock).mockResolvedValueOnce(undefined);

      await expect(repository.getUnResolvedErrorSignalLogByDeviceId('deviceId')).rejects.toThrow(
        StudioNotFoundError,
      );
    });
  });

  describe('getErrorSignalLogByCreationDateRange', () => {
    it('should return studio objects from db', async () => {
      const currentTime = new Date();
      const mockStudio: DbStudioErrorSignalLog[] = [
        {
          id: 1,
          deviceId: 'deviceId',
          errorSignal: { msgId: '', metadata: {} },
          resolved: false,
          createdAt: currentTime,
          updatedAt: currentTime,
        },
      ];

      (mockQueryBuilder.getRawMany as jest.Mock).mockResolvedValueOnce(mockStudio);

      const result = await repository.getErrorSignalLogByCreationDateRange(
        currentTime,
        currentTime,
      );
      expect(result).toBe(mockStudio);

      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'studio.CREATED_AT BETWEEN :start_date AND :end_date',
        {
          start_date: currentTime,
          end_date: currentTime,
        },
      );
    });
  });

  describe('insertErrorSignalLog', () => {
    it('should insert a studio object to db', async () => {
      const mockSignalInput = { msgId: '', metadata: {} };
      const currentTime = new Date();
      const mockInsertResult = {
        raw: [
          {
            ID: 1,
            DEVICE_ID: 'deviceId',
            ERROR_SIGNAL: mockSignalInput,
            RESOLVED: false,
            CREATED_AT: currentTime,
            UPDATED_AT: currentTime,
          },
        ],
      };

      (mockQueryBuilder.execute as jest.Mock).mockResolvedValueOnce(mockInsertResult);

      const result = await repository.insertErrorSignalLog('idp', mockSignalInput);
      expect(result).toEqual({
        id: 1,
        deviceId: 'deviceId',
        errorSignal: mockSignalInput,
        resolved: false,
        createdAt: currentTime,
        updatedAt: currentTime,
      });
    });
  });

  describe('updateErrorSignalLog', () => {
    it('should update a studio object to db', async () => {
      const mockUpdateEntity = { deviceId: 'deviceId' };
      const currentTime = new Date();
      const mockInsertResult = {
        raw: [
          {
            ID: 1,
            DEVICE_ID: 'deviceId',
            ERROR_SIGNAL: { msgId: '', metadata: {} },
            RESOLVED: false,
            CREATED_AT: currentTime,
            UPDATED_AT: currentTime,
          },
        ],
      };

      (mockQueryBuilder.execute as jest.Mock).mockResolvedValueOnce(mockInsertResult);

      const result = await repository.updateErrorSignalLog(mockUpdateEntity);
      expect(result).toEqual({
        id: 1,
        deviceId: 'deviceId',
        errorSignal: { msgId: '', metadata: {} },
        resolved: false,
        createdAt: currentTime,
        updatedAt: currentTime,
      });

      expect(mockQueryBuilder.set).toHaveBeenCalledWith({ resolved: true });
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('deviceId = :deviceId', {
        deviceId: mockUpdateEntity.deviceId,
      });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('resolved = :resolved', {
        resolved: false,
      });
    });

    it('should throw an studio if none modified', async () => {
      const mockUpdateEntity = { deviceId: 'deviceId' };
      const currentTime = new Date();
      const mockInsertResult = {
        raw: [],
        affected: 0,
      };

      (mockQueryBuilder.execute as jest.Mock).mockResolvedValueOnce(mockInsertResult);

      await expect(repository.updateErrorSignalLog(mockUpdateEntity)).rejects.toThrow(
        StudioUpdateError,
      );
    });
  });

  describe('IsUnResolved', () => {
    it('should return whether device has resolved', async () => {
      const mockUpdateEntity = { deviceId: 'deviceId' };
      const currentTime = new Date();
      const mockResult = {
        ID: 1,
        DEVICE_ID: 'deviceId',
        ERROR_SIGNAL: { msgId: '', metadata: {} },
        RESOLVED: false,
        CREATED_AT: currentTime,
        UPDATED_AT: currentTime,
      };

      (mockQueryBuilder.getRawOne as jest.Mock).mockResolvedValueOnce(mockResult);

      await expect(repository.IsUnResolved('deviceId')).resolves.toEqual(true);

      expect(mockQueryBuilder.where).toHaveBeenCalledWith('studio.DEVICE_ID = :deviceID', {
        deviceID: 'deviceId',
      });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('studio.RESOLVED = :resolved', {
        resolved: false,
      });
    });
  });
});
