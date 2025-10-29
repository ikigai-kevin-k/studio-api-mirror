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
        msgId: '',
        content: '',
        errorSignal: {},
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

  describe('insertErrorSignalLog', () => {
    it('should insert a studio object to db', async () => {
      const mockSignalInput = {};
      const currentTime = new Date();
      const mockInsertResult = {
        raw: [
          {
            ID: 1,
            DEVICE_ID: 'deviceId',
            MESSAGE_ID: '',
            CONTENT: '',
            ERROR_SIGNAL: mockSignalInput,
            RESOLVED: false,
            CREATED_AT: currentTime,
            UPDATED_AT: currentTime,
          },
        ],
      };

      (mockQueryBuilder.execute as jest.Mock).mockResolvedValueOnce(mockInsertResult);

      const result = await repository.insertErrorSignalLog({
        deviceId: 'idp',
        msgId: '',
        content: '',
        errorSignal: mockSignalInput,
      });
      expect(result).toEqual({
        id: 1,
        deviceId: 'deviceId',
        msgId: '',
        content: '',
        errorSignal: mockSignalInput,
        resolved: false,
        createdAt: currentTime,
        updatedAt: currentTime,
      });
    });
  });

  describe('updateErrorSignalLog', () => {
    it('should update a studio object to db', async () => {
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

      const result = await repository.resolveErrorSignalLogsByDeviceId('deviceId');
      expect(result).toEqual([
        {
          id: 1,
          deviceId: 'deviceId',
          errorSignal: { msgId: '', metadata: {} },
          resolved: false,
          createdAt: currentTime,
          updatedAt: currentTime,
        },
      ]);

      expect(mockQueryBuilder.set).toHaveBeenCalledWith({ resolved: true });
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('deviceId = :deviceId', {
        deviceId: 'deviceId',
      });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('resolved = :resolved', {
        resolved: false,
      });
    });

    it('should throw an error if none modified', async () => {
      const mockInsertResult = {
        raw: [],
        affected: 0,
      };

      (mockQueryBuilder.execute as jest.Mock).mockResolvedValueOnce(mockInsertResult);

      await expect(repository.resolveErrorSignalLogsByDeviceId('deviceId')).rejects.toThrow(
        StudioUpdateError,
      );
    });
  });
});
