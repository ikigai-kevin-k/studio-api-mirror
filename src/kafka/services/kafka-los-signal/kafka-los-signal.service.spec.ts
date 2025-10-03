/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoggerService } from '@ikigaians/logger';
import { KafkaHub } from '@ikigaians/queue-pub-sub';
import { TopicLosSignalError } from 'src/kafka/topics/los-signal-error.topic';
import { KafkaLosSignalService } from './kafka-los-signal.service';

const mockKafkaHub = {
  publish: jest.fn(),
};

const mockLoggerService = {
  info: jest.fn(),
  error: jest.fn(),
};

describe('LosSignalService', () => {
  let service: KafkaLosSignalService;

  beforeAll(() => {
    service = new KafkaLosSignalService(
      mockKafkaHub as unknown as KafkaHub,
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
    const mockData = {
      msgId: '1',
      metadata: {
        gameCode: 'ARO-001',
        tablename: '',
        title: '',
        description: '',
        code: '',
        suggestion: '',
      },
    };

    it('should publish to Kafka', async () => {
      await service['publish'](mockData);

      expect(mockKafkaHub.publish).toHaveBeenCalledTimes(1);
      expect(mockKafkaHub.publish).toHaveBeenCalledWith(TopicLosSignalError, mockData);
    });
  });
});
