/* eslint-disable unicorn/no-null */
/* eslint-disable unicorn/no-useless-undefined */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoggerService } from 'src/log';
import { SlackService } from 'src/slack/slack.service';
import { StudioDeviceDataService } from 'src/studio/services/studio-device/studio-device-data.service';
import { StudioService } from 'src/studio/services/studio/studio.service';
import { TableApiSignalService } from 'src/table-api/services/table-api-signal/table-api-signal.service';
import { WsService } from 'src/ws/ws.service';
import { Unsubscribe } from 'src/ws/ws.service.type';
import { TableApiSignalObserver } from './table-api-signal.observer';

const mockWsService = {
  subscribe: jest.fn(),
} as unknown as WsService;

const mockStudioDeviceDataService = {
  getDeviceBelongTo: jest.fn(),
} as unknown as StudioDeviceDataService;

const mockStudioService = {
  getStudioTableBelongTo: jest.fn(),
} as unknown as StudioService;

const mockTableApiSignalServer = {
  forwardSignal: jest.fn(),
} as unknown as TableApiSignalService;

const mockSlackService = {
  broadcast: jest.fn(),
} as unknown as SlackService;

const mockLoggerService = {
  info: jest.fn(),
  error: jest.fn(),
} as unknown as LoggerService;

describe('TableApiSignalObserver', () => {
  let observer: TableApiSignalObserver;

  beforeEach(() => {
    observer = new TableApiSignalObserver(
      mockWsService,
      mockTableApiSignalServer,
      mockStudioDeviceDataService,
      mockStudioService,
      mockSlackService,
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
      const mockData = { signal: { error: 'Test Signal' } };

      (mockStudioDeviceDataService.getDeviceBelongTo as jest.Mock).mockReturnValue('tableId');
      (mockStudioService.getStudioTableBelongTo as jest.Mock).mockReturnValue('gameId');
      await (observer as any).onServiceSignal(query, {}, mockData);

      expect(mockTableApiSignalServer.forwardSignal).toHaveBeenCalled();
    });

    it('should log error if gameCode is missing', async () => {
      const query = new URLSearchParams('');
      const mockData = { signal: { error: 'Test Signal' } };

      await (observer as any).onServiceSignal(query, {}, mockData);

      expect(mockTableApiSignalServer.forwardSignal).not.toHaveBeenCalled();
      expect(mockLoggerService.error).toHaveBeenCalled();
    });

    it('should log error if device does not belong to any table', async () => {
      const query = new URLSearchParams('id=ws-table');
      const mockData = { signal: { error: 'Test Signal' } };

      (mockStudioDeviceDataService.getDeviceBelongTo as jest.Mock).mockReturnValue('tableId');
      (mockStudioService.getStudioTableBelongTo as jest.Mock).mockReturnValue(undefined);
      await (observer as any).onServiceSignal(query, {}, mockData);

      expect(mockTableApiSignalServer.forwardSignal).not.toHaveBeenCalled();
      expect(mockLoggerService.error).toHaveBeenCalled();
    });
  });
});
