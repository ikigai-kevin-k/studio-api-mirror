/* eslint-disable unicorn/no-null */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoggerService } from 'src/log';
import { WsService } from 'src/ws/ws.service';
import { Unsubscribe } from 'src/ws/ws.service.type';
import { SlackObserver } from './slack.observer';
import { SlackService } from './slack.service';

const mockWsService = {
  subscribe: jest.fn(),
} as unknown as WsService;

const mockSlackService = {
  broadcast: jest.fn(),
} as unknown as SlackService;

const mockLoggerService = {
  error: jest.fn(),
} as unknown as LoggerService;

describe('SlackObserver', () => {
  let observer: SlackObserver;

  beforeEach(() => {
    observer = new SlackObserver(mockWsService, mockSlackService, mockLoggerService);
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
      const mockData = { signal: { error: 'Test Signal' } };

      await (observer as any).onServiceSignal({}, {}, mockData);

      expect(mockSlackService.broadcast).toHaveBeenCalled();
    });

    it('if it does not have signal data, do nothing', async () => {
      await (observer as any).onServiceSignal({}, {});

      expect(mockSlackService.broadcast).not.toHaveBeenCalled();
    });
  });
});
