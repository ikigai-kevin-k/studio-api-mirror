// los-cdn.service.spec.ts
/* eslint-disable unicorn/no-null */
/* eslint-disable unicorn/no-useless-undefined */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable unicorn/no-empty-file */
// los-cdn.service.spec.ts

import axios, { AxiosError } from 'axios';
import { CacheService } from 'src/cache/cache.service';
import { AppConfigService } from 'src/config';
import { LoggerService } from 'src/log';
import { LosConnectFailureError } from 'src/los/errors/los-connect-failure';
import { LosNotFoundTokenError } from 'src/los/errors/los-not-found-token';
import { LosCdnService } from 'src/los/services/los-cdn/los-cdn.service';
import { CdnGroup } from 'src/los/services/los-cdn/los-cdn.service.type';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockCacheService = {
  get: jest.fn(),
  set: jest.fn(),
  delete: jest.fn(),
} as unknown as CacheService;

const mockAppConfigService = {
  amConfig: { url: 'http://am.test.com' },
  losConfig: { url: 'http://los.test.com' },
} as unknown as AppConfigService;

const mockLoggerService = {
  info: jest.fn(),
  error: jest.fn(),
} as unknown as LoggerService;

describe('LosCdnService', () => {
  let service: LosCdnService;

  beforeEach(() => {
    service = new LosCdnService(mockCacheService, mockAppConfigService, mockLoggerService);
    jest.clearAllMocks();
  });

  describe('onInit and onDispose', () => {
    it('should be callable and return without errors', async () => {
      await expect(service.onInit()).resolves.toBeUndefined();
      await expect(service.onDispose()).resolves.toBeUndefined();
    });
  });
  /*
  describe('getToken', () => {
    it('should return a token from cache', async () => {
      (mockCacheService.get as jest.Mock).mockResolvedValue('test-token');
      const token = await (service as any).getToken();
      expect(mockCacheService.get).toHaveBeenCalled();
      expect(token).toBe('test-token');
    });

    it('should return null if no token is in cache', async () => {
      (mockCacheService.get as jest.Mock).mockResolvedValue(null);
      const token = await (service as any).getToken();
      expect(token).toBeNull();
    });
  });
*/
  describe('send', () => {
    it('should return a response on the first successful attempt', async () => {
      const mockResponse = { status: 200, data: {}, headers: {}, statusText: '', config: {} };
      const mockProcess = jest.fn().mockResolvedValue(mockResponse);
      const result = await (service as any).send(mockProcess, 3);
      expect(mockProcess).toHaveBeenCalledTimes(1);
      expect(result).toBe(mockResponse);
    });

    it('should retry and return a response after a failure', async () => {
      const mockError: AxiosError = {
        name: 'AxiosError',
        message: 'Test Error',
        isAxiosError: true,
        toJSON: () => ({}),
        config: {} as any,
      };
      const mockResponse = { status: 200, data: {}, headers: {}, statusText: '', config: {} };
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
      const mockError: AxiosError = {
        name: 'AxiosError',
        message: 'Retry Error',
        isAxiosError: true,
        toJSON: () => ({}),
        config: {} as any,
      };
      const mockProcess = jest.fn().mockRejectedValue(mockError);
      const result = await (service as any).send(mockProcess, 3);
      expect(mockProcess).toHaveBeenCalledTimes(3);
      expect(mockLoggerService.error).toHaveBeenCalledTimes(3);
      expect(result).toBeUndefined();
    });
  });

  describe('sendCDN', () => {
    it('should call axios.patch with the correct payload', async () => {
      const mockResponse = { status: 200, data: {}, headers: {}, statusText: '', config: {} };
      mockedAxios.patch.mockResolvedValue(mockResponse);
      const mockData: CdnGroup = { primary: { lo: '' }, secondary: { lo: '' } } as any;
      await (service as any).sendCDN('table1', 'token1', mockData);
      expect(mockedAxios.patch).toHaveBeenCalledWith(
        'http://los.test.com/v1/internal/tables/table1',
        { streams: mockData },
        expect.any(Object),
      );
    });
  });

  describe('updateCDN', () => {
    const mockTableId = 'test-table';
    const mockData: CdnGroup = { primary: { lo: '' }, secondary: { lo: '' } } as any;

    it('should throw LosNotFoundTokenError if no token is found', async () => {
      jest.spyOn(service as any, 'getToken').mockResolvedValue(null);
      await expect(service.updateCDN(mockTableId, mockData)).rejects.toThrow(LosNotFoundTokenError);
      expect(jest.spyOn(service as any, 'send')).not.toHaveBeenCalled();
    });

    it('should throw LosConnectFailureError if send fails all retries', async () => {
      jest.spyOn(service as any, 'getToken').mockResolvedValue('test-token');
      jest.spyOn(service as any, 'send').mockResolvedValue(undefined);
      await expect(service.updateCDN(mockTableId, mockData)).rejects.toThrow(
        LosConnectFailureError,
      );
    });

    it('should complete successfully if a response is received', async () => {
      jest.spyOn(service as any, 'getToken').mockResolvedValue('test-token');
      const mockResponse = { status: 200, data: {}, headers: {}, statusText: '', config: {} };
      jest.spyOn(service as any, 'send').mockResolvedValue(mockResponse);
      await expect(service.updateCDN(mockTableId, mockData)).resolves.toBeUndefined();
    });
  });
});
