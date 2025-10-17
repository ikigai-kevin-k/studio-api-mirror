// studio-status.service.spec.ts
/* eslint-disable unicorn/no-null */
/* eslint-disable unicorn/no-useless-undefined */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoggerService } from '@ikigaians/logger';
import { SlackService } from 'src/slack/slack.service';

import { StudioErrorSignalService } from 'src/studio/services/studio-error-signal/studio-error-signal.service';
import { WsService } from 'src/ws/ws.service';
import { StudioErrorSignalObserver } from './studio-error-signal.observer';
import { StudioErrorSignalObserverInput } from './studio-error-signal.observer.type';

const mockStudioErrorSignalService = {
  forwardErrorSignal: jest.fn(),
} as unknown as StudioErrorSignalService;

const mockSlackService = {
  broadcast: jest.fn(),
} as unknown as SlackService;

const mockWsService = {
  subscribe: jest.fn(),
} as unknown as WsService;

const mockLoggerService = {
  info: jest.fn(),
  error: jest.fn(),
} as unknown as LoggerService;

describe('StudioErrorSignalObserver', () => {
  let observer: StudioErrorSignalObserver;

  beforeEach(() => {
    observer = new StudioErrorSignalObserver(
      mockStudioErrorSignalService,
      mockSlackService,
      mockWsService,
      mockLoggerService,
    );
    jest.clearAllMocks();
  });

  describe('onInit and onDispose', () => {
    it('should subscribe to ws events on init and unsubscribe on dispose', async () => {
      const mockUnsubscribe = jest.fn();
      (mockWsService.subscribe as jest.Mock).mockReturnValue(mockUnsubscribe);

      await observer.onInit();

      expect(mockWsService.subscribe).toHaveBeenCalled();

      await observer.onDispose();

      expect(mockUnsubscribe).toHaveBeenCalled();
    });
  });

  describe('onServiceStatus', () => {
    it('should call forwardErrorSignal to forward error signal', async () => {
      const query = new URLSearchParams('id=idp');
      const ws = { send: jest.fn() } as any;
      const input: StudioErrorSignalObserverInput = {
        signal: { msgId: '', metadata: {} },
        cmd: {},
      };

      await (observer as any).onServiceSignal(query, ws, input);

      expect(mockStudioErrorSignalService.forwardErrorSignal).toHaveBeenCalledWith(
        'idp',
        input.signal,
      );
    });

    it('should broadcast error if auth fail', async () => {
      const query = new URLSearchParams('');
      const ws = { send: jest.fn() } as any;
      const input: StudioErrorSignalObserverInput = {
        signal: { msgId: '', metadata: {} },
        cmd: {},
      };

      await (observer as any).onServiceSignal(query, ws, input);

      expect(mockSlackService.broadcast).toHaveBeenCalledTimes(1);
    });

    it('should broadcast error if auth fail', async () => {
      const query = new URLSearchParams('id=idp');
      const ws = { send: jest.fn() } as any;

      await (observer as any).onServiceSignal(query, ws, undefined);

      expect(mockSlackService.broadcast).toHaveBeenCalledTimes(1);
    });
  });
});
