/* eslint-disable @typescript-eslint/no-explicit-any */
import { getLiveTableSessionHeaders } from '@ikigaians/web';
import { AppConfigService } from 'src/config';
import { LoggerService } from 'src/log';
import { TableApiConnectFailureError } from 'src/table-api/errors/table-api.error';
import { TableApiSchema } from 'src/table-api/schema/table-api.schema';
import { send } from 'src/utils/send-utils';
import { fetch } from 'undici';
import { TableApiCdnService } from './table-api-cdn.service';
import { TableApiCdnServiceInput } from './table-api-cdn.type';

const mockAppConfigService = {
  tableApiConfig: {
    url: 'http://mock-table-api-url.com',
    maxRetry: 3,
  },
};

const mockLoggerService = {
  error: jest.fn(),
  info: jest.fn(),
};

jest.mock('undici');
const mockFetch = fetch as jest.Mock;

jest.mock('@ikigaians/web', () => ({
  getLiveTableSessionHeaders: jest.fn(),
}));

jest.mock('src/utils/send-utils', () => ({
  send: jest.fn(),
}));

describe('TableApiCdnService', () => {
  let service: TableApiCdnService;
  let mockSend: jest.Mock;
  let mockGetLiveTableSessionHeaders: jest.Mock;

  beforeAll(() => {
    service = new TableApiCdnService(
      mockAppConfigService as unknown as AppConfigService,
      mockLoggerService as unknown as LoggerService,
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockSend = send as jest.Mock;
    mockGetLiveTableSessionHeaders = getLiveTableSessionHeaders as jest.Mock;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendCDN', () => {
    const gameCode = 'test-game';
    const cdnData: TableApiCdnServiceInput = {
      primary: { lo: 'lo1', me: 'me1', hi: 'hi1', hd: 'hd1' },
      secondary: { lo: 'lo2', me: 'lo2', hi: 'lo2', hd: 'lo2' },
    };
    const mockHeaders = { Cookie: 'test-cookie' };
    const mockResponse = {
      ok: true,
      json: () =>
        Promise.resolve({
          data: { table: { streams: cdnData } },
        } as TableApiSchema),
    };

    it('should successfully call external API with correct headers and data', async () => {
      mockGetLiveTableSessionHeaders.mockReturnValue(mockHeaders);
      mockFetch.mockResolvedValue(mockResponse);

      const result = await service['sendCDN'](gameCode, cdnData);

      expect(mockFetch).toHaveBeenCalledWith(
        `${mockAppConfigService.tableApiConfig.url}/v2/service/tables/${gameCode}`,
        {
          method: 'PATCH',
          headers: { ...mockHeaders, 'content-type': 'application/json' },
          body: JSON.stringify({ streams: cdnData }),
        },
      );
      expect(result).toEqual({ data: { table: { streams: cdnData } } });
    });

    it('should throw an error if the fetch response is not ok', async () => {
      const errorResponse = {
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: () => Promise.resolve(mockResponse),
      };
      mockFetch.mockResolvedValue(errorResponse);

      await expect((service as any).sendCDN(gameCode, gameCode)).rejects.toBeDefined();
    });
  });

  describe('forwardCDN', () => {
    const gameCode = 'test-game';
    const cdnData: TableApiCdnServiceInput = {
      primary: { lo: 'lo1', me: 'me1', hi: 'hi1', hd: 'hd1' },
      secondary: { lo: 'lo2', me: 'lo2', hi: 'lo2', hd: 'lo2' },
    };

    it('should successfully call the send utility and log the response', async () => {
      const mockResponse = { data: 'update success' };
      mockSend.mockResolvedValue(mockResponse);

      await service.forwardCDN(gameCode, cdnData);

      expect(mockSend).toHaveBeenCalledWith(
        expect.any(Function),
        mockAppConfigService.tableApiConfig.maxRetry,
        mockLoggerService,
      );
    });

    it('should throw TableApiConnectFailureError if the send utility throws an error', async () => {
      const mockError = new Error('Connection failed');
      mockSend.mockRejectedValue(mockError);

      await expect(service.forwardCDN(gameCode, cdnData)).rejects.toThrow(
        TableApiConnectFailureError,
      );
    });
  });

  describe('lifecycle methods', () => {
    it('onInit should not throw any error', async () => {
      await expect(service.onInit()).resolves.toBeUndefined();
    });

    it('onDispose should not throw any error', async () => {
      await expect(service.onDispose()).resolves.toBeUndefined();
    });
  });
});
