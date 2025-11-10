/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoggerService } from '@ikigaians/logger';
import { KafkaHub } from '@ikigaians/queue-pub-sub';
import { LosSignalErrorTopic } from 'src/kafka/topics/los-signal-error.topic';
import { LosSignalResolveTopic } from 'src/kafka/topics/los-signal-resolve.topic';
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

  describe('publishError', () => {
    const mockData = {
      msgId: '1',
      content: '',
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
      await service.publishError(mockData);

      expect(mockKafkaHub.publish).toHaveBeenCalledTimes(1);
      expect(mockKafkaHub.publish).toHaveBeenCalledWith(LosSignalErrorTopic, mockData);
    });
  });

  describe('publishResolve', () => {
    const mockData = {
      signalIds: [1],
      timestamp: 0,
      gameCode: 'gameCode',
      tableCode: 'tableCode',
    };

    it('should publish to Kafka', async () => {
      await service.publishResolve(mockData);

      expect(mockKafkaHub.publish).toHaveBeenCalledTimes(1);
      expect(mockKafkaHub.publish).toHaveBeenCalledWith(LosSignalResolveTopic, mockData);
    });
  });
});
