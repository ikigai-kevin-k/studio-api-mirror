// slack.service.spec.ts
/* eslint-disable unicorn/no-null */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { WebClient } from '@slack/web-api';
import { AppConfigService } from 'src/config';
import { LoggerService } from 'src/log';
import { SlackService } from 'src/slack/slack.service';
import { WsService } from 'src/ws/ws.service';
import { Unsubscribe } from 'src/ws/ws.service.type';

// Mock 掉 Slack WebClient
const mockChatPostMessage = jest.fn();
jest.mock('@slack/web-api', () => ({
  WebClient: jest.fn(() => ({
    chat: {
      postMessage: mockChatPostMessage,
    },
  })),
}));

// Mock 掉所有依賴的服務
const mockWsService = {
  subscribe: jest.fn(),
} as unknown as WsService;

const mockLoggerService = {
  error: jest.fn(),
} as unknown as LoggerService;

const mockAppConfigService = {
  slackConfig: {
    token: 'mock-slack-token',
    channel: 'mock-channel',
  },
  config: {
    appEnv: 'mock-env',
  },
} as unknown as AppConfigService;

describe('SlackService', () => {
  let service: SlackService;

  beforeEach(() => {
    service = new SlackService(mockWsService, mockLoggerService, mockAppConfigService);
    jest.clearAllMocks();
  });

  describe('onInit', () => {
    it('should initialize a WebClient and subscribe to a ws event', async () => {
      const mockUnsubscribe: Unsubscribe = jest.fn();
      (mockWsService.subscribe as jest.Mock).mockReturnValue(mockUnsubscribe);

      await service.onInit();

      expect(WebClient).toHaveBeenCalledWith('mock-slack-token');
      expect((service as any).unSubscribes).toEqual([mockUnsubscribe]);
    });
  });

  describe('onDispose', () => {
    it('should call unsubscribe functions and clear the client', async () => {
      const mockUnsubscribe: Unsubscribe = jest.fn();
      (service as any).unSubscribes = [mockUnsubscribe];
      (service as any).client = new WebClient('');

      await service.onDispose();

      expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
      expect((service as any).client).toBeUndefined();
    });
  });

  describe('broadcast', () => {
    it('should post a message to slack channel on success', async () => {
      mockChatPostMessage.mockResolvedValueOnce({});
      (service as any).client = new WebClient('');

      const testMessage = 'Test exception message';
      await service.broadcast(testMessage);

      expect(mockChatPostMessage).toHaveBeenCalledTimes(1);
      expect(mockLoggerService.error).not.toHaveBeenCalled();
    });

    it('should log an error if postMessage fails', async () => {
      const mockError = 'Slack API error';
      mockChatPostMessage.mockRejectedValueOnce(mockError);
      (service as any).client = new WebClient('');

      const testMessage = 'Test exception message';
      await service.broadcast(testMessage);

      expect(mockChatPostMessage).toHaveBeenCalledTimes(1);
      expect(mockLoggerService.error).toHaveBeenCalledWith(mockError);
    });
  });

  describe('onServiceSignal', () => {
    it('should parse and broadcast the signal data', async () => {
      const spyBroadcast = jest.spyOn(service, 'broadcast');
      const mockData = { signal: { error: 'Test Signal' } };

      await (service as any).onServiceSignal({}, {}, mockData);

      expect(spyBroadcast).toHaveBeenCalledWith(JSON.stringify(mockData.signal, null, 2));
    });
  });
});
