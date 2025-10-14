import { LoggerService } from '@ikigaians/logger';
import { ModuleLifecycle } from '@ikigaians/mod';
import { GlobalKafkaHub } from '@ikigaians/queue-pub-sub';
import { LosSignalErrorTopic } from 'src/kafka/topics/los-signal-error.topic';
import { KafkaLosSignalServiceInput } from './kafka-los-signal.service.type';

export class KafkaLosSignalService implements ModuleLifecycle {
  constructor(
    private readonly globalKafkaHub: GlobalKafkaHub,
    private readonly logger: LoggerService,
  ) {}

  async publish(data: KafkaLosSignalServiceInput) {
    return await this.globalKafkaHub.publish(LosSignalErrorTopic, data);
  }

  async onInit(): Promise<void> {}
}
