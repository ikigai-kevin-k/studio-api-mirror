import { LoggerService } from '@ikigaians/logger';
import { ModuleLifecycle } from '@ikigaians/mod';
import { ConsumeStrategy, getConsumerGroupId, GlobalKafkaHub } from '@ikigaians/queue-pub-sub';
import {
  StudioTableSwitchPayload,
  StudioTableSwitchTopic,
} from 'src/kafka/topics/studio-table-switch.topic';
import { StudioTableSwitchService } from 'src/studio/services/studio-table-switch/studio-table-switch.service';

export class StudioTableSwitchConsumer implements ModuleLifecycle {
  constructor(
    private readonly globalKafkaHub: GlobalKafkaHub,
    private readonly studioTableSwitchService: StudioTableSwitchService,
    private readonly logger: LoggerService,
  ) {}

  async onInit(): Promise<void> {
    await this.globalKafkaHub.subscribe(StudioTableSwitchTopic, this.handler.bind(this), {
      groupId: getConsumerGroupId(ConsumeStrategy.BROADCAST),
    });
  }

  private async handler({ deviceId }: StudioTableSwitchPayload): Promise<void> {
    this.logger.info(`[StudioTableSwitchConsumer] handle table switch: deviceId = ${deviceId}`);
    this.studioTableSwitchService.handle({ deviceId });
  }
}
