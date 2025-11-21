// studio-status.service.spec.ts
/* eslint-disable unicorn/no-null */
/* eslint-disable unicorn/no-useless-undefined */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoggerService } from '@ikigaians/logger';
import { SlackService } from 'src/slack/slack.service';

import { StudioDeviceStatusEnum } from 'src/studio/enums/studio.enums';
import { StudioErrorSignalService } from 'src/studio/services/studio-error-signal/studio-error-signal.service';
import { StudioTableSwitchService } from 'src/studio/services/studio-table-switch/studio-table-switch.service';
import { WsService } from 'src/ws/ws.service';
import { StudioDeviceStatusObserver } from './studio-device-status.observer';
import { StudioDeviceStatusObserverInput } from './studio-device-status.observer.type';

const mockStudioErrorSignalService = {
  forwardResolveSignal: jest.fn(),
} as unknown as StudioErrorSignalService;

const mockStudioTableSwitchService = {
  publish: jest.fn(),
} as unknown as StudioTableSwitchService;

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

describe('StudioDeviceStatusObserver', () => {
  let observer: StudioDeviceStatusObserver;

  beforeEach(() => {
    observer = new StudioDeviceStatusObserver(
      mockStudioErrorSignalService,
      mockStudioTableSwitchService,
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
    it('should call forwardResolveSignal to forward resolve signal', async () => {
      const query = new URLSearchParams('id=idp');
      const ws = { send: jest.fn() } as any;
      const input: StudioDeviceStatusObserverInput = {
        status: StudioDeviceStatusEnum.UP,
      };

      await (observer as any).onServiceStatus(query, ws, input);

      expect(mockStudioErrorSignalService.forwardResolveSignal).toHaveBeenCalledWith('idp');
    });

    it('should call publish to switch game table', async () => {
      const query = new URLSearchParams('id=idp');
      const ws = { send: jest.fn() } as any;
      const input: StudioDeviceStatusObserverInput = {
        status: StudioDeviceStatusEnum.DOWN,
      };

      await (observer as any).onServiceStatus(query, ws, input);

      expect(mockStudioTableSwitchService.publish).toHaveBeenCalledWith({ deviceId: 'idp' });
    });

    it('should broadcast error if auth fail', async () => {
      const query = new URLSearchParams('');
      const ws = { send: jest.fn(), close: jest.fn(), error: jest.fn() } as any;
      const input: StudioDeviceStatusObserverInput = {
        status: StudioDeviceStatusEnum.UP,
      };

      await (observer as any).onServiceStatus(query, ws, input);

      expect(mockSlackService.broadcast).toHaveBeenCalledTimes(1);
    });

    it('should broadcast error if auth fail', async () => {
      const query = new URLSearchParams('id=idp');
      const ws = { send: jest.fn(), close: jest.fn(), error: jest.fn() } as any;

      await (observer as any).onServiceStatus(query, ws, undefined);

      expect(mockSlackService.broadcast).toHaveBeenCalledTimes(1);
    });
  });
});
