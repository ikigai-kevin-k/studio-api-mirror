// los-signal.service.spec.ts
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unicorn/no-null */
/* eslint-disable unicorn/no-useless-undefined */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppConfigService } from 'src/config';
import { LoggerService } from 'src/log';
import { LosSignalService } from 'src/los/services/los-signal/los-signal.service';
import { LosSignalServiceInput } from 'src/los/services/los-signal/los-signal.service.type';

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
    service = new LosSignalService(mockAppConfigService, mockLoggerService);
    jest.clearAllMocks();
  });

  describe('onInit', () => {
    it('should be callable and return without errors', async () => {
      await expect(service.onInit()).resolves.toBeUndefined();
    });
  });

  describe('send', () => {
    const mockResponse = { status: 200, data: {}, headers: {}, statusText: '', config: {} };
    const mockError = 'Test Error';

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
    const mockData: LosSignalServiceInput = { msgId: '1', metadata: {} };

    it('should return data on successful signal update', async () => {
      jest.spyOn(service as any, 'getToken').mockResolvedValue('test-token');
      const mockResponse = JSON.stringify({ data: { success: true } });

      jest.spyOn(service as any, 'send').mockResolvedValue(mockResponse);
      const result = await service.updateSignal(mockTableId, mockDeviceId, mockData);
      expect(result).toEqual(mockResponse);
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
});
