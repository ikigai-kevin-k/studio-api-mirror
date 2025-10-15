/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable unicorn/no-useless-undefined */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { LoggerService } from '@ikigaians/logger';
import { KafkaLosSignalService } from 'src/kafka/services/kafka-los-signal/kafka-los-signal.service';
import { StudioDeviceDataService } from 'src/studio/services/studio-device/studio-device-data.service';
import { StudioService } from 'src/studio/services/studio/studio.service';

import { StudioErrorSignalLogService } from 'src/studio/services/studio-log/studio-error-signal-log.service';
import { TableApiQueryService } from 'src/table-api/services/table-api-query/table-api-query.service';
import { TableApiSignalService } from 'src/table-api/services/table-api-signal/table-api-signal.service';
import { StudioInvalidStateError, StudioNotFoundError } from '../errors/studio.error';
import { StudioErrorSignalHandler } from './studio-error-signal.handler';
import { StudioErrorSignalHandlerInput } from './studio-error-signal.handler.type';

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
  isUnResolvedLogExist: jest.fn(),
  insertLog: jest.fn(),
  updateLog: jest.fn(),
} as unknown as StudioErrorSignalLogService;

const mockKafkaLosSignalService = {
  publish: jest.fn(),
} as unknown as KafkaLosSignalService;

const mockTableApiSignalService = {
  forwardSignal: jest.fn(),
} as unknown as TableApiSignalService;

const mockLoggerService = {
  info: jest.fn(),
  error: jest.fn(),
} as unknown as LoggerService;

describe('StudioErrorSignalHandler', () => {
  let handler: StudioErrorSignalHandler;

  beforeEach(() => {
    handler = new StudioErrorSignalHandler(
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
      await expect(handler.onInit()).resolves.toBeUndefined();
    });
  });

  describe('insertSignalLog', () => {
    it('should return a log from db', async () => {
      const input: StudioErrorSignalHandlerInput = {
        msgId: '',
        metadata: {},
      };
      const result = {
        deviceId: 'idp',
        errorSignal: input,
      };
      (mockStudioErrorSignalLogService.isUnResolvedLogExist as jest.Mock).mockResolvedValueOnce(
        false,
      );

      (mockStudioErrorSignalLogService.insertLog as jest.Mock).mockResolvedValueOnce(result);

      await expect((handler as any).insertSignalLog('idp', input)).resolves.toBe(result);
    });

    it('should throw an error if unsolved exist', async () => {
      const input: StudioErrorSignalHandlerInput = {
        msgId: '',
        metadata: {},
      };
      (mockStudioErrorSignalLogService.isUnResolvedLogExist as jest.Mock).mockResolvedValueOnce(
        true,
      );

      await expect((handler as any).insertSignalLog('idp', input)).rejects.toThrow(
        StudioInvalidStateError,
      );
    });
  });

  describe('queryDeviceBelong', () => {
    it('should return a log from db', async () => {
      (mockStudioDeviceDataService.getDeviceBelongTo as jest.Mock).mockResolvedValueOnce(
        'tableCode',
      );
      (mockStudioService.getStudioTableBelongTo as jest.Mock).mockResolvedValueOnce('gameCode');
      (mockTableApiQueryService.getTableName as jest.Mock).mockResolvedValueOnce('auto roulette');

      await expect((handler as any).queryDeviceBelong('idp')).resolves.toEqual({
        gameId: 'gameCode',
        tableName: 'auto roulette',
      });
    });

    it('should throw an error if data does not find', async () => {
      (mockStudioDeviceDataService.getDeviceBelongTo as jest.Mock).mockResolvedValueOnce(
        'tableCode',
      );
      (mockStudioService.getStudioTableBelongTo as jest.Mock).mockResolvedValueOnce('');

      await expect((handler as any).queryDeviceBelong('idp')).rejects.toThrow(StudioNotFoundError);
    });
  });

  describe('forwardErrorSignal', () => {
    it('should return a log from db', async () => {
      const input: StudioErrorSignalHandlerInput = {
        msgId: '',
        metadata: {},
      };
      const spyQueryDeviceBelong = jest.spyOn(handler as any, 'queryDeviceBelong');
      spyQueryDeviceBelong.mockResolvedValueOnce({
        gameId: 'gameCode',
        tableName: 'auto roulette',
      });

      const spyInsertSignalLog = jest.spyOn(handler as any, 'insertSignalLog');
      spyInsertSignalLog.mockResolvedValueOnce({ id: 1 });

      const result = await handler.forwardErrorSignal('idp', input);

      expect(mockKafkaLosSignalService.publish).toHaveBeenCalledTimes(1);
      expect(mockTableApiSignalService.forwardSignal).toHaveBeenCalledTimes(1);

      expect(result).toEqual({
        msgId: '',
        metadata: { gameCode: 'gameCode', tableName: 'auto roulette', signalId: 1 },
      });
    });
  });

  describe('forwardResolveSignal', () => {
    it('should return a log from db', async () => {
      const output = {
        id: 1,
        deviceId: 'idp',
        errorSignal: {},
        resolved: false,
      };

      (mockStudioErrorSignalLogService.updateLog as jest.Mock).mockResolvedValueOnce(output);

      await expect(handler.forwardResolveSignal('idp')).resolves.toBe(output);
    });
  });
});
