// studio-status.service.spec.ts
/* eslint-disable unicorn/no-null */
/* eslint-disable unicorn/no-useless-undefined */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoggerService } from '@ikigaians/logger';
import { GlobalKafkaHub } from '@ikigaians/queue-pub-sub';
import { StudioTableSwitchPayload } from 'src/kafka/topics/studio-table-switch.topic';
import { StudioTableSwitchService } from 'src/studio/services/studio-table-switch/studio-table-switch.service';
import { StudioTableSwitchConsumer } from './studio-table-switch.consumer';

const mockStudioTableSwitchService = {
  handle: jest.fn(),
} as unknown as StudioTableSwitchService;

const mockGlobalKafkaHub = {
  subscribe: jest.fn(),
} as unknown as GlobalKafkaHub;

const mockLoggerService = {
  info: jest.fn(),
  error: jest.fn(),
} as unknown as LoggerService;

describe('StudioTableSwitchConsumer', () => {
  let consumer: StudioTableSwitchConsumer;

  beforeEach(() => {
    consumer = new StudioTableSwitchConsumer(
      mockGlobalKafkaHub,
      mockStudioTableSwitchService,
      mockLoggerService,
    );
    jest.clearAllMocks();
  });

  describe('onInit', () => {
    it('should subscribe to the Kafka topic with the correct group id', async () => {
      await consumer.onInit();

      expect(mockGlobalKafkaHub.subscribe).toHaveBeenCalled();
    });
  });

  describe('handler', () => {
    it('should log info and broadcast the message via wsService', async () => {
      const mockPayload: StudioTableSwitchPayload = {
        deviceId: 'device',
      };

      await (consumer as any).handler(mockPayload);

      expect(mockLoggerService.info).toHaveBeenCalled();
      expect(mockStudioTableSwitchService.handle).toHaveBeenCalledWith({ deviceId: 'device' });
    });
  });
});
