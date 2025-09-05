// los-signal.service.spec.ts
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unicorn/no-null */
/* eslint-disable unicorn/no-useless-undefined */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoggerService } from '@ikigaians/logger';
import { AppConfigService } from 'src/config';
import { LosSignalService } from 'src/los/services/los-signal/los-signal.service';
import { WsService } from 'src/ws/ws.service';
import { WebSocket } from 'ws';
import { LosSignalObserver } from './los-signal.observer';

const mockWsService = {
  subscribe: jest.fn(),
} as unknown as WsService;

const mockLosSignalService = {
  updateSignal: jest.fn(),
} as unknown as LosSignalService;

const mockAppConfigService = {
  amConfig: { user: 'am-user' },
  losConfig: { url: 'http://los.test.com' },
} as unknown as AppConfigService;

const mockLoggerService = {
  info: jest.fn(),
  error: jest.fn(),
} as unknown as LoggerService;

describe('LosSignalObserver', () => {
  let observer: LosSignalObserver;

  beforeEach(() => {
    observer = new LosSignalObserver(
      mockWsService,
      mockLosSignalService,
      mockAppConfigService,
      mockLoggerService,
    );
    jest.clearAllMocks();
  });

  describe('onInit and onDispose', () => {
    it('should subscribe to exception event on init and unsubscribe on dispose', async () => {
      const mockUnsubscribe = jest.fn();
      (mockWsService.subscribe as jest.Mock).mockReturnValue(mockUnsubscribe);

      await observer.onInit();

      expect(mockWsService.subscribe).toHaveBeenCalled();

      await observer.onDispose();

      expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe('onServiceSignal', () => {
    const mockWs = { send: jest.fn() } as unknown as WebSocket;

    it('should call updateSignal with correct data and log info on success', async () => {
      const mockQuery = new URLSearchParams('id=table-1&device=device-1');
      const mockData = { signal: { msgId: 'test-msg' } };
      (mockLosSignalService.updateSignal as jest.Mock).mockResolvedValue('success');
      await (observer as any).onServiceSignal(mockQuery, mockWs, mockData);
      expect(mockLosSignalService.updateSignal).toHaveBeenCalledWith(
        'table-1',
        'device-1',
        mockData.signal,
      );
      expect(mockLoggerService.info).toHaveBeenCalledWith('success');
    });

    it('should use fallback deviceId if not provided', async () => {
      const mockQuery = new URLSearchParams('id=table-1');
      const mockData = { signal: { msgId: 'test-msg' } };
      (mockLosSignalService.updateSignal as jest.Mock).mockResolvedValue('');
      await (observer as any).onServiceSignal(mockQuery, mockWs, mockData);
      expect(mockLosSignalService.updateSignal).toHaveBeenCalledWith(
        'table-1',
        'am-user',
        mockData.signal,
      );
    });

    it('should log error if updateSignal fails', async () => {
      const mockQuery = new URLSearchParams('id=table-1&device=device-1');
      const mockData = { signal: { msgId: 'test-msg' } };
      const mockError = new Error('Update failed');
      (mockLosSignalService.updateSignal as jest.Mock).mockRejectedValue(mockError);
      await (observer as any).onServiceSignal(mockQuery, mockWs, mockData);
      expect(mockLoggerService.error).toHaveBeenCalledWith('Error: Update failed');
    });

    it('should log error if tableId is missing from query', async () => {
      const mockQuery = new URLSearchParams('device=device-1');
      const mockData = { signal: { msgId: 'test-msg' } };
      await (observer as any).onServiceSignal(mockQuery, mockWs, mockData);
      expect(mockLoggerService.error).toHaveBeenCalledWith(
        'Error: Unknown tableId Exception Signal !!',
      );
    });
  });
});
