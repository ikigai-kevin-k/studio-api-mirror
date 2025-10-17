/* eslint-disable unicorn/no-null */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable unicorn/no-useless-undefined */
import { LoggerService } from '@ikigaians/logger';

import { StudioErrorSignalLogRepository } from 'src/studio/repositories/studio-log/studio-error-signal-log.repository';
import { StudioErrorSignalLogService } from './studio-error-signal-log.service';
import { ErrorSignalLogServiceOutput } from './studio-error-signal-log.service.type';

const mockStudioErrorSignalLogRepository = {
  getErrorSignalLogById: jest.fn(),
  insertErrorSignalLog: jest.fn(),
  updateErrorSignalLog: jest.fn(),
  getUnResolvedErrorSignalLogByDeviceId: jest.fn(),
  IsUnResolved: jest.fn(),
} as unknown as StudioErrorSignalLogRepository;

const mockLoggerService = {
  info: jest.fn(),
  error: jest.fn(),
} as unknown as LoggerService;

describe('StudioErrorSignalLogService', () => {
  let service: StudioErrorSignalLogService;

  beforeEach(() => {
    service = new StudioErrorSignalLogService(
      mockStudioErrorSignalLogRepository,
      mockLoggerService,
    );
    jest.clearAllMocks();
  });

  describe('onInit', () => {
    it('should be callable and return without errors', async () => {
      await expect(service.onInit()).resolves.toBeUndefined();
    });
  });

  describe('getLog', () => {
    it('should return a data from db', async () => {
      const currentTime = new Date();

      const mockResult: ErrorSignalLogServiceOutput = {
        id: 1,
        deviceId: 'idp',
        errorSignal: { msgId: '', metadata: {} },
        resolved: false,
        updatedAt: currentTime,
        createdAt: currentTime,
      };

      (mockStudioErrorSignalLogRepository.getErrorSignalLogById as jest.Mock).mockResolvedValueOnce(
        mockResult,
      );

      const result = await service.getLog(1);
      expect(result).toBe(mockResult);
    });
  });

  describe('insertLog', () => {
    it('should insert a data to db', async () => {
      const currentTime = new Date();

      const mockSignal = { msgId: '', metadata: {} };

      const mockResult: ErrorSignalLogServiceOutput = {
        id: 1,
        deviceId: 'idp',
        errorSignal: mockSignal,
        resolved: false,
        updatedAt: currentTime,
        createdAt: currentTime,
      };

      (mockStudioErrorSignalLogRepository.insertErrorSignalLog as jest.Mock).mockResolvedValueOnce(
        mockResult,
      );

      const result = await service.insertLog({ deviceId: 'idp', errorSignal: mockSignal });
      expect(result).toBe(mockResult);
    });
  });

  describe('updateLog', () => {
    it('should modify a data in db', async () => {
      const currentTime = new Date();

      const mockResult: ErrorSignalLogServiceOutput = {
        id: 1,
        deviceId: 'idp',
        errorSignal: { msgId: '', metadata: {} },
        resolved: false,
        updatedAt: currentTime,
        createdAt: currentTime,
      };

      (mockStudioErrorSignalLogRepository.updateErrorSignalLog as jest.Mock).mockResolvedValueOnce(
        mockResult,
      );

      const result = await service.updateLog('idp');
      expect(result).toBe(mockResult);
    });
  });
});
