/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable unicorn/no-useless-undefined */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { LoggerService } from '@ikigaians/logger';
import { KafkaLosSignalService } from 'src/kafka/services/kafka-los-signal/kafka-los-signal.service';
import { StudioDeviceDataService } from 'src/studio/services/studio-device/studio-device-data.service';
import { StudioService } from 'src/studio/services/studio/studio.service';

import { StudioNotFoundError } from 'src/studio/errors/studio.error';
import { StudioErrorSignalLogService } from 'src/studio/services/studio-log/studio-error-signal-log.service';
import { TableApiQueryService } from 'src/table-api/services/table-api-query/table-api-query.service';
import { TableApiSignalService } from 'src/table-api/services/table-api-signal/table-api-signal.service';
import { StudioErrorSignalService } from './studio-error-signal.service';
import { StudioErrorSignalServiceInput } from './studio-error-signal.service.type';

const mockTableApiQueryService = {
  getTableName: jest.fn(),
} as unknown as TableApiQueryService;

const mockStudioDeviceDataService = {
  getDeviceBelongTo: jest.fn(),
} as unknown as StudioDeviceDataService;

const mockStudioService = {
  getStudioTableBelongTo: jest.fn(),
} as unknown as StudioService;

const mockStudioErrorSignalLogService = {
  insertLog: jest.fn(),
  updateLog: jest.fn(),
} as unknown as StudioErrorSignalLogService;

const mockKafkaLosSignalService = {
  publishError: jest.fn(),
  publishResolve: jest.fn(),
} as unknown as KafkaLosSignalService;

const mockTableApiSignalService = {
  forwardSignal: jest.fn(),
} as unknown as TableApiSignalService;

const mockLoggerService = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
} as unknown as LoggerService;

describe('StudioErrorSignalHandler', () => {
  let service: StudioErrorSignalService;

  beforeEach(() => {
    service = new StudioErrorSignalService(
      mockTableApiQueryService,
      mockStudioDeviceDataService,
      mockStudioService,
      mockStudioErrorSignalLogService,
      mockKafkaLosSignalService,
      mockTableApiSignalService,
      mockLoggerService,
    );
    jest.clearAllMocks();
  });

  describe('onInit', () => {
    it('should be callable and return without errors', async () => {
      await expect(service.onInit()).resolves.toBeUndefined();
    });
  });

  describe('insertSignalLog', () => {
    it('should return a log from db', async () => {
      const input: StudioErrorSignalServiceInput = {
        msgId: '',
        content: '',
        metadata: {},
      };
      const result = {
        deviceId: 'idp',
        errorSignal: input,
      };

      (mockStudioErrorSignalLogService.insertLog as jest.Mock).mockResolvedValueOnce(result);

      await expect((service as any).insertSignalLog('idp', input)).resolves.toBe(result);
    });
  });

  describe('queryDeviceBelong', () => {
    it('should return a log from db', async () => {
      (mockStudioDeviceDataService.getDeviceBelongTo as jest.Mock).mockResolvedValueOnce(
        'tableCode',
      );
      (mockStudioService.getStudioTableBelongTo as jest.Mock).mockResolvedValueOnce('gameCode');
      (mockTableApiQueryService.getTableName as jest.Mock).mockResolvedValueOnce('auto roulette');

      await expect((service as any).queryDeviceBelong('idp')).resolves.toEqual({
        gameId: 'gameCode',
        tableName: 'auto roulette',
      });
    });

    it('should throw an error if data does not find', async () => {
      (mockStudioDeviceDataService.getDeviceBelongTo as jest.Mock).mockResolvedValueOnce(
        'tableCode',
      );
      (mockStudioService.getStudioTableBelongTo as jest.Mock).mockResolvedValueOnce('');

      await expect((service as any).queryDeviceBelong('idp')).rejects.toThrow(StudioNotFoundError);
    });
  });

  describe('forwardErrorSignal', () => {
    it('should return a log from db', async () => {
      const currentTime = new Date();
      const input: StudioErrorSignalServiceInput = {
        msgId: '',
        content: '',
        metadata: {},
      };
      const spyQueryDeviceBelong = jest.spyOn(service as any, 'queryDeviceBelong');
      spyQueryDeviceBelong.mockResolvedValueOnce({
        gameId: 'gameCode',
        tableName: 'auto roulette',
      });

      const spyInsertSignalLog = jest.spyOn(service as any, 'insertSignalLog');
      spyInsertSignalLog.mockResolvedValueOnce({ id: 1, createdAt: currentTime });

      const result = await service.forwardErrorSignal('idp', input);

      expect(mockKafkaLosSignalService.publishError).toHaveBeenCalledTimes(1);
      expect(mockTableApiSignalService.forwardSignal).toHaveBeenCalledTimes(1);

      expect(result).toEqual({
        msgId: '',
        content: '',
        metadata: {
          gameCode: 'gameCode',
          tableName: 'auto roulette',
          signalId: 1,
          timestamp: currentTime.getTime(),
        },
      });
    });
  });

  describe('forwardResolveSignal', () => {
    it('should return a log from db', async () => {
      const output = [
        {
          id: 1,
          deviceId: 'idp',
          errorSignal: {},
          resolved: false,
        },
      ];

      jest.spyOn(service as any, 'resolveErrorSignal').mockResolvedValue(output);

      await expect(service.forwardResolveSignal('idp')).resolves.toBe(output);
    });
  });

  describe('resolveErrorSignal', () => {
    it('should call updateLog', async () => {
      const output = [
        {
          id: 1,
          deviceId: 'idp',
          errorSignal: {},
          resolved: false,
        },
      ];
      (mockStudioErrorSignalLogService.updateLog as jest.Mock).mockResolvedValueOnce(output);

      const result = await (service as any).resolveErrorSignal('idp');
      expect(result).toBe(output);
    });

    it('should return [] if throw error', async () => {
      (mockStudioErrorSignalLogService.updateLog as jest.Mock).mockRejectedValueOnce(Error);

      const result = await (service as any).resolveErrorSignal('idp');
      expect(result).toEqual([]);
    });
  });
});
