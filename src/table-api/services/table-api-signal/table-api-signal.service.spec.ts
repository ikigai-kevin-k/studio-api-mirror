/* eslint-disable unicorn/no-useless-undefined */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppConfigService } from 'src/config';
import { send } from 'src/global/utils/send-utils';
import { LoggerService } from 'src/log';
import { TableApiSignalService } from 'src/table-api/services/table-api-signal/table-api-signal.service';
import { TableApiSignalServiceInput } from 'src/table-api/services/table-api-signal/table-api-signal.service.type';
import { fetch } from 'undici';

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

describe('TableApiSignalService', () => {
  let service: TableApiSignalService;
  let mockSend: jest.Mock;

  beforeEach(() => {
    service = new TableApiSignalService(mockAppConfigService, mockLoggerService);
    jest.clearAllMocks();
    mockSend = send as jest.Mock;
  });

  describe('onInit', () => {
    it('should be callable and return without errors', async () => {
      await expect(service.onInit()).resolves.toBeUndefined();
    });
  });

  describe('sendSignal', () => {
    it('should call fetch with the correct parameters and return json on success', async () => {
      const mockTableId = 'table-1';
      const mockData: TableApiSignalServiceInput = { msgId: '1', metadata: {} };
      const mockResponse = {
        ok: true,
        status: 200,
        json: () => Promise.resolve({ success: true }),
      };
      mockedFetch.mockResolvedValue(mockResponse);

      const result = await (service as any).sendSignal(mockTableId, mockData);

      expect(mockedFetch).toHaveBeenCalledWith(
        'http://tableapi.test.com/v2/service/tables/table-1/broadcast',
        {
          method: 'POST',
          headers: { Cookie: 'mock-cookie', 'content-type': 'application/json' },
          body: JSON.stringify(mockData),
        },
      );
      expect(result).toEqual({ success: true });
    });

    it('should throw an error if the fetch response is not ok', async () => {
      const mockTableId = 'table-1';
      const mockData: TableApiSignalServiceInput = { msgId: '1', metadata: {} };
      const mockResponse = {
        ok: false,
        status: 400,
        json: () => Promise.resolve({ error: { code: 10_001, message: '' } }),
      };
      mockedFetch.mockResolvedValue(mockResponse);

      await expect((service as any).sendSignal(mockTableId, mockData)).rejects.toBeDefined();
    });
  });

  describe('forwardSignal', () => {
    const mockTableId = 'table-1';
    const mockData: TableApiSignalServiceInput = { msgId: '1', metadata: {} };

    it('should return the response if send is successful', async () => {
      mockSend.mockResolvedValue('Successful Response');

      const result = await service.forwardSignal(mockTableId, mockData);

      expect(mockSend).toHaveBeenCalledWith(
        expect.any(Function),
        mockAppConfigService.tableApiConfig.maxRetry,
        mockLoggerService,
      );
      expect(result).toBe('Successful Response');
    });
  });
});
