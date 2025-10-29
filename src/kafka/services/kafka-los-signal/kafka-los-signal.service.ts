import { LoggerService } from '@ikigaians/logger';
import { ModuleLifecycle } from '@ikigaians/mod';
import { GlobalKafkaHub } from '@ikigaians/queue-pub-sub';
import { LosSignalErrorTopic } from 'src/kafka/topics/los-signal-error.topic';
import { LosSignalResolveTopic } from 'src/kafka/topics/los-signal-resolve.topic';
import {
  KafkaLosSignalServiceErrorInput,
  KafkaLosSignalServiceResolveInput,
} from './kafka-los-signal.service.type';

export class KafkaLosSignalService implements ModuleLifecycle {
  constructor(
    private readonly globalKafkaHub: GlobalKafkaHub,
    private readonly logger: LoggerService,
  ) {}

  async publishError(data: KafkaLosSignalServiceErrorInput) {
    return await this.globalKafkaHub.publish(LosSignalErrorTopic, data);
  }

  async publishResolve(data: KafkaLosSignalServiceResolveInput) {
    return await this.globalKafkaHub.publish(LosSignalResolveTopic, data);
  }

  async onInit(): Promise<void> {}
}
