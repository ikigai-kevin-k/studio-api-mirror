/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoggerService } from '@ikigaians/logger';
import { GlobalKafkaHub } from '@ikigaians/queue-pub-sub';
import { StudioTableSwitchTopic } from 'src/kafka/topics/studio-table-switch.topic';
import { KafkaStudioSwitchService } from './kafka-studio-switch.service';

const mockKafkaHub = {
  publish: jest.fn(),
};

const mockLoggerService = {
  info: jest.fn(),
  error: jest.fn(),
};

describe('KafkaStudioSwitchService', () => {
  let service: KafkaStudioSwitchService;

  beforeAll(() => {
    service = new KafkaStudioSwitchService(
      mockKafkaHub as unknown as GlobalKafkaHub,
      mockLoggerService as unknown as LoggerService,
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onInit', () => {
    it('should be callable and return without errors', async () => {
      await expect(service.onInit()).resolves.toBeUndefined();
    });
  });

  describe('publish', () => {
    it('should publish to Kafka', async () => {
      await service.publish('deviceId');

      expect(mockKafkaHub.publish).toHaveBeenCalledWith(StudioTableSwitchTopic, {
        deviceId: 'deviceId',
      });
    });
  });
});
