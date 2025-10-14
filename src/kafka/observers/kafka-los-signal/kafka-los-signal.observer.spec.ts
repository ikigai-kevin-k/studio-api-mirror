/* eslint-disable unicorn/no-null */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoggerService } from '@ikigaians/logger';
import { KafkaLosSignalService } from 'src/kafka/services/kafka-los-signal/kafka-los-signal.service';
import { SlackService } from 'src/slack/slack.service';
import { StudioDeviceDataService } from 'src/studio/services/studio-device/studio-device-data.service';
import { StudioService } from 'src/studio/services/studio/studio.service';
import { TableApiQueryService } from 'src/table-api/services/table-api-query/table-api-query.service';
import { WsService } from 'src/ws/ws.service';
import { Unsubscribe } from 'src/ws/ws.service.type';
import { KafkaLosSignalObserver } from './kafka-los-signal.observer';

const mockWsService = {
  subscribe: jest.fn(),
} as unknown as WsService;

const mockLosSignalService = {
  publish: jest.fn(),
} as unknown as KafkaLosSignalService;

const mockTableApiQueryService = {
  getTableName: jest.fn(),
} as unknown as TableApiQueryService;

const mockStudioDeviceDataService = {
  getDeviceBelongTo: jest.fn(),
} as unknown as StudioDeviceDataService;

const mockStudioService = {
  getStudioTableBelongTo: jest.fn(),
} as unknown as StudioService;

const mockSlackService = {
  broadcast: jest.fn(),
} as unknown as SlackService;

const mockLoggerService = {
  error: jest.fn(),
} as unknown as LoggerService;

describe('LosSignalObserver', () => {
  let observer: KafkaLosSignalObserver;

  beforeEach(() => {
    observer = new KafkaLosSignalObserver(
      mockTableApiQueryService,
      mockStudioDeviceDataService,
      mockStudioService,
      mockLosSignalService,
      mockSlackService,
      mockWsService,
      mockLoggerService,
    );
    jest.clearAllMocks();
  });

  describe('onInit', () => {
    it('should initialize a WebClient and subscribe to a ws event', async () => {
      const mockUnsubscribe: Unsubscribe = jest.fn();
      (mockWsService.subscribe as jest.Mock).mockReturnValue(mockUnsubscribe);

      await observer.onInit();

      expect((observer as any).unSubscribes).toEqual([mockUnsubscribe]);
    });
  });

  describe('onDispose', () => {
    it('should call unsubscribe functions and clear the client', async () => {
      const mockUnsubscribe: Unsubscribe = jest.fn();
      (observer as any).unSubscribes = [mockUnsubscribe];

      await observer.onDispose();

      expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe('onServiceSignal', () => {
    it('should parse and broadcast the signal data', async () => {
      const query = new URLSearchParams('id=ws-table');
      const mockData = { signal: { metadata: {} } };

      (mockStudioDeviceDataService.getDeviceBelongTo as jest.Mock).mockReturnValue('tableId');
      (mockStudioService.getStudioTableBelongTo as jest.Mock).mockReturnValue('gameId');

      await (observer as any).onServiceSignal(query, {}, mockData);

      expect(mockLosSignalService.publish).toHaveBeenCalled();
    });

    it('should log error if device does not belong to any table', async () => {
      const query = new URLSearchParams('id=ws-table');
      const mockData = { signal: { error: 'Test Signal' } };

      (mockStudioDeviceDataService.getDeviceBelongTo as jest.Mock).mockReturnValue('');

      await (observer as any).onServiceSignal(query, {}, mockData);

      expect(mockLoggerService.error).toHaveBeenCalled();
    });

    it('should log error if table does not belong to any game', async () => {
      const query = new URLSearchParams('id=ws-table');
      const mockData = { signal: { error: 'Test Signal' } };

      (mockStudioDeviceDataService.getDeviceBelongTo as jest.Mock).mockReturnValue('tableId');
      (mockStudioService.getStudioTableBelongTo as jest.Mock).mockReturnValue('');

      await (observer as any).onServiceSignal(query, {}, mockData);

      expect(mockLoggerService.error).toHaveBeenCalled();
    });
  });
});
