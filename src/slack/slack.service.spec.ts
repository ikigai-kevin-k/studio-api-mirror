// slack.service.spec.ts
/* eslint-disable unicorn/no-null */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { WebClient } from '@slack/web-api';
import { AppConfigService } from 'src/config';
import { LoggerService } from 'src/log';
import { SlackService } from 'src/slack/slack.service';

const mockChatPostMessage = jest.fn();
jest.mock('@slack/web-api', () => ({
  WebClient: jest.fn(() => ({
    chat: {
      postMessage: mockChatPostMessage,
    },
  })),
}));

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
    service = new SlackService(mockLoggerService, mockAppConfigService);
    jest.clearAllMocks();
  });

  describe('onInit', () => {
    it('should initialize a WebClient and subscribe to a ws event', async () => {
      await service.onInit();

      expect(WebClient).toHaveBeenCalledWith('mock-slack-token');
    });
  });

  describe('onDispose', () => {
    it('should call unsubscribe functions and clear the client', async () => {
      (service as any).client = new WebClient('');
      await service.onDispose();
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
});
