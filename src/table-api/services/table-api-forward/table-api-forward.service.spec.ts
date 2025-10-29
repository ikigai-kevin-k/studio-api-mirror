/* eslint-disable unicorn/no-useless-undefined */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppConfigService } from 'src/config';
import { send } from 'src/global/utils/send-utils';
import { LoggerService } from 'src/log';
import { fetch } from 'undici';
import { TableApiForwardService } from './table-api-forward.service';

jest.mock('undici');
const mockedFetch = fetch as jest.Mock;

jest.mock('@ikigaians/web', () => ({
  getLiveTableSessionHeaders: jest.fn(() => ({ Cookie: 'mock-cookie' })),
}));

jest.mock('src/global/utils/send-utils', () => ({
  send: jest.fn(),
}));

const mockAppConfigService = {
  tableApiConfig: { url: 'http://tableapi.test.com', maxRetry: 3 },
} as unknown as AppConfigService;

const mockLoggerService = {
  error: jest.fn(),
  info: jest.fn(),
} as unknown as LoggerService;

describe('TableApiForwardService', () => {
  let service: TableApiForwardService;
  let mockSend: jest.Mock;

  beforeEach(() => {
    service = new TableApiForwardService(mockAppConfigService, mockLoggerService);
    jest.clearAllMocks();
    mockSend = send as jest.Mock;
  });

  describe('onInit', () => {
    it('should be callable and return without errors', async () => {
      await expect(service.onInit()).resolves.toBeUndefined();
    });
  });

  describe('updateCDN', () => {
    it('should call fetch with the correct parameters and return json on success', async () => {
      const mockGameCode = 'gameId';
      const mockCDN = {
        primary: { lo: '', me: '', hi: '', hd: '' },
        secondary: { lo: '', me: '', hi: '', hd: '' },
      };
      const mockResponse = {
        ok: true,
        status: 200,
        json: () => Promise.resolve({ success: true }),
      };
      mockedFetch.mockResolvedValue(mockResponse);

      const result = await (service as any).updateCDN(mockGameCode, mockCDN);

      expect(mockedFetch).toHaveBeenCalledWith(
        'http://tableapi.test.com/v2/service/tables/gameId',
        {
          method: 'PATCH',
          headers: { Cookie: 'mock-cookie', 'content-type': 'application/json' },
          body: JSON.stringify({ streams: mockCDN }),
        },
      );
      expect(result).toEqual({ success: true });
    });

    it('should throw an error if the fetch response is not ok', async () => {
      const mockGameCode = 'gameId';
      const mockCDN = {
        primary: { lo: '', me: '', hi: '', hd: '' },
        secondary: { lo: '', me: '', hi: '', hd: '' },
      };
      const mockResponse = {
        ok: false,
        status: 400,
        error: { code: 10_001, message: '' },
        json: () => Promise.resolve(mockResponse),
      };
      mockedFetch.mockResolvedValue(mockResponse);

      await expect((service as any).updateCDN(mockGameCode, mockCDN)).rejects.toBeDefined();
    });
  });

  describe('forwardCDN', () => {
    it('should return the response if send is successful', async () => {
      await (service as any).forwardCDN('gameId', {
        primary: { lo: '', me: '', hi: '', hd: '' },
        secondary: { lo: '', me: '', hi: '', hd: '' },
      });

      expect(mockSend).toHaveBeenCalledWith(
        expect.any(Function),
        mockAppConfigService.tableApiConfig.maxRetry,
        mockLoggerService,
      );
    });
  });
});
