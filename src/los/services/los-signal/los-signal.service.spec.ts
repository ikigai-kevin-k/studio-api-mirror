// los-signal.service.spec.ts
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unicorn/no-null */
/* eslint-disable unicorn/no-useless-undefined */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError } from 'axios';
import { CacheService } from 'src/cache/cache.service';
import { AppConfigService } from 'src/config';
import { LoggerService } from 'src/log';
import { LosSignalService } from 'src/los/services/los-signal/los-signal.service';
import { SignalData } from 'src/los/services/los-signal/los-signal.service.type';
import { WsService } from 'src/ws/ws.service';
import { WebSocket } from 'ws';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockWsService = {
  subscribe: jest.fn(),
} as unknown as WsService;

const mockCacheService = {
  get: jest.fn(),
} as unknown as CacheService;

const mockAppConfigService = {
  amConfig: { user: 'am-user' },
  losConfig: { url: 'http://los.test.com' },
} as unknown as AppConfigService;

const mockLoggerService = {
  info: jest.fn(),
  error: jest.fn(),
} as unknown as LoggerService;

describe('LosSignalService', () => {
  let service: LosSignalService;

  beforeEach(() => {
    service = new LosSignalService(
      mockWsService,
      mockCacheService,
      mockAppConfigService,
      mockLoggerService,
    );
    jest.clearAllMocks();
  });

  describe('onInit and onDispose', () => {
    it('should subscribe to exception event on init and unsubscribe on dispose', async () => {
      const mockUnsubscribe = jest.fn();
      (mockWsService.subscribe as jest.Mock).mockReturnValue(mockUnsubscribe);

      await service.onInit();

      expect(mockWsService.subscribe).toHaveBeenCalled();

      await service.onDispose();

      expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
    });
  });
  /*
  describe('getToken', () => {
    it('should return a token from cache', async () => {
      (mockCacheService.get as jest.Mock).mockResolvedValue('test-token');
      const token = await (service as any).getToken('device-1');
      expect(mockCacheService.get).toHaveBeenCalledWith('studio-los-token-device-1');
      expect(token).toBe('test-token');
    });

    it('should return null if no token is in cache', async () => {
      (mockCacheService.get as jest.Mock).mockResolvedValue(null);
      const token = await (service as any).getToken('device-1');
      expect(token).toBeNull();
    });
  });
*/
  describe('send', () => {
    const mockResponse = { status: 200, data: {}, headers: {}, statusText: '', config: {} };
    const mockError: AxiosError = {
      name: 'AxiosError',
      message: 'Test Error',
      isAxiosError: true,
      toJSON: () => ({}),
      config: { headers: {} } as any,
    };

    it('should return a response on the first successful attempt', async () => {
      const mockProcess = jest.fn().mockResolvedValue(mockResponse);
      const result = await (service as any).send(mockProcess, 3);
      expect(mockProcess).toHaveBeenCalledTimes(1);
      expect(result).toBe(mockResponse);
    });

    it('should retry and return a response after a failure', async () => {
      const mockProcess = jest
        .fn()
        .mockRejectedValueOnce(mockError)
        .mockResolvedValue(mockResponse);
      const result = await (service as any).send(mockProcess, 3);
      expect(mockProcess).toHaveBeenCalledTimes(2);
      expect(mockLoggerService.error).toHaveBeenCalledWith('Test Error');
      expect(result).toBe(mockResponse);
    });

    it('should return undefined if all retries fail', async () => {
      const mockProcess = jest.fn().mockRejectedValue(mockError);
      const result = await (service as any).send(mockProcess, 3);
      expect(mockProcess).toHaveBeenCalledTimes(3);
      expect(mockLoggerService.error).toHaveBeenCalledTimes(3);
      expect(result).toBeUndefined();
    });
  });

  describe('updateSignal', () => {
    const mockTableId = 'test-table';
    const mockDeviceId = 'test-device';
    const mockData: SignalData = { msgId: '1', metadata: {} };

    it('should return data on successful signal update', async () => {
      jest.spyOn(service as any, 'getToken').mockResolvedValue('test-token');
      const mockResponse = {
        status: 200,
        data: { data: { success: true } },
        headers: {},
        statusText: '',
        config: {},
      };
      jest.spyOn(service as any, 'send').mockResolvedValue(mockResponse);
      const result = await service.updateSignal(mockTableId, mockDeviceId, mockData);
      expect(result).toEqual({ success: true });
    });

    it('should throw error if no token is found', async () => {
      jest.spyOn(service as any, 'getToken').mockResolvedValue(null);
      await expect(service.updateSignal(mockTableId, mockDeviceId, mockData)).rejects.toThrow(
        `gameCode: ${mockTableId}, device: ${mockDeviceId}, token is null !!`,
      );
    });

    it('should throw error if send fails all retries', async () => {
      jest.spyOn(service as any, 'getToken').mockResolvedValue('test-token');
      jest.spyOn(service as any, 'send').mockResolvedValue(undefined);
      await expect(service.updateSignal(mockTableId, mockDeviceId, mockData)).rejects.toThrow(
        `gameCode: ${mockTableId}, device: ${mockDeviceId}, send los updateSignal failure !!`,
      );
    });
  });

  describe('onServiceSignal', () => {
    const mockWs = { send: jest.fn() } as unknown as WebSocket;

    it('should call updateSignal with correct data and log info on success', async () => {
      const mockQuery = new URLSearchParams('id=table-1&device=device-1');
      const mockData = { signal: { msgId: 'test-msg' } };
      jest.spyOn(service, 'updateSignal').mockResolvedValue({ success: true });
      await (service as any).onServiceSignal(mockQuery, mockWs, mockData);
      expect(service.updateSignal).toHaveBeenCalledWith('table-1', 'device-1', mockData.signal);
      expect(mockLoggerService.info).toHaveBeenCalledWith({ success: true });
    });

    it('should use fallback deviceId if not provided', async () => {
      const mockQuery = new URLSearchParams('id=table-1');
      const mockData = { signal: { msgId: 'test-msg' } };
      jest.spyOn(service, 'updateSignal').mockResolvedValue({});
      await (service as any).onServiceSignal(mockQuery, mockWs, mockData);
      expect(service.updateSignal).toHaveBeenCalledWith('table-1', 'am-user', mockData.signal);
    });

    it('should log error if updateSignal fails', async () => {
      const mockQuery = new URLSearchParams('id=table-1&device=device-1');
      const mockData = { signal: { msgId: 'test-msg' } };
      const mockError = new Error('Update failed');
      jest.spyOn(service, 'updateSignal').mockRejectedValue(mockError);
      await (service as any).onServiceSignal(mockQuery, mockWs, mockData);
      expect(mockLoggerService.error).toHaveBeenCalledWith('Error: Update failed');
    });

    it('should log error if tableId is missing from query', async () => {
      const mockQuery = new URLSearchParams('device=device-1');
      const mockData = { signal: { msgId: 'test-msg' } };
      await (service as any).onServiceSignal(mockQuery, mockWs, mockData);
      expect(mockLoggerService.error).toHaveBeenCalledWith(
        'Error: Unknown tableId Exception Signal !!',
      );
    });
  });
});
