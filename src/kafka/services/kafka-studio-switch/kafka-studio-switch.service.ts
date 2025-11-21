import { LoggerService } from '@ikigaians/logger';
import { ModuleLifecycle } from '@ikigaians/mod';
import { GlobalKafkaHub } from '@ikigaians/queue-pub-sub';
import { StudioTableSwitchTopic } from 'src/kafka/topics/studio-table-switch.topic';
export class KafkaStudioSwitchService implements ModuleLifecycle {
  constructor(
    private readonly globalKafkaHub: GlobalKafkaHub,
    private readonly logger: LoggerService,
  ) {}

  async publish(deviceId: string) {
    return await this.globalKafkaHub.publish(StudioTableSwitchTopic, {
      deviceId,
    });
  }

  async onInit(): Promise<void> {}
}
