/* eslint-disable @typescript-eslint/no-unused-vars */
import { LoggerService } from '@ikigaians/logger';
import { KafkaQueueServiceConfig } from '@ikigaians/queue';
import { AppConfigService } from 'src/config/app-config.service';
import { GlobalQueueService } from './global-queue.service';

jest.mock('@ikigaians/queue', () => ({
  KafkaService: class {
    queueCfg: KafkaQueueServiceConfig | undefined;
    connect(cfg: KafkaQueueServiceConfig) {
      this.queueCfg = cfg;
    }
    disconnect() {}
  },
}));

describe('GlobalQueueService', () => {
  let queue: GlobalQueueService;
  const logger = {} as unknown as LoggerService;
  const config = {} as unknown as AppConfigService;
  beforeEach(async () => {
    process.env.APP_ENV = 'test';
    queue = new GlobalQueueService(logger, config);
  });

  describe('onInit', () => {
    it('should connect with params when onInit', async () => {
      const spy = jest.spyOn(queue, 'connect');
      await queue.onInit();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('onDispose', () => {
    it('should disconnect with params when onDispose', async () => {
      const spy = jest.spyOn(queue, 'disconnect');
      await queue.onDispose();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
