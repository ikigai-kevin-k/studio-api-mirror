import { LoggerService } from 'src/log';
import { send } from './send-utils';

const mockLoggerService = {
  error: jest.fn(),
} as unknown as LoggerService;

describe('Send', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a response on the first successful attempt', async () => {
    const mockResponse = { data: 'ok' };
    const mockProcess = jest.fn().mockResolvedValue(mockResponse);
    const result = await send(mockProcess, 3);
    expect(mockProcess).toHaveBeenCalledTimes(1);
    expect(result).toBe(mockResponse);
  });

  it('should retry and return a response after a failure', async () => {
    const mockProcess = jest
      .fn()
      .mockRejectedValueOnce(new Error('Error 1'))
      .mockResolvedValue('Successful Response');
    const result = await send(mockProcess, 3, mockLoggerService);
    expect(mockProcess).toHaveBeenCalledTimes(2);
    expect(mockLoggerService.error).toHaveBeenCalledWith('Error 1');
    expect(result).toBe('Successful Response');
  });

  it('should return undefined if all retries fail', async () => {
    const mockProcess = jest.fn().mockRejectedValue('Retry Error');
    await expect(send(mockProcess, 3, mockLoggerService)).rejects.toBeDefined();
    expect(mockProcess).toHaveBeenCalledTimes(3);
    expect(mockLoggerService.error).toHaveBeenCalledTimes(3);
  });
});
