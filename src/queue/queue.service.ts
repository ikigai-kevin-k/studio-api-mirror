import { LoggerService } from '@ikigaians/logger';
import { ModuleLifecycle } from '@ikigaians/mod';
import { KafkaService } from '@ikigaians/queue';
import { AppConfigService } from 'src/config';

export class QueueService extends KafkaService implements ModuleLifecycle {
  constructor(
    logger: LoggerService,
    private readonly appConfigService: AppConfigService,
  ) {
    super(logger);
  }

  async onInit(): Promise<void> {
    const queue = this.appConfigService.queueConfig;
    await this.connect(queue);
  }

  async onDispose(): Promise<void> {
    await this.disconnect();
  }
}
