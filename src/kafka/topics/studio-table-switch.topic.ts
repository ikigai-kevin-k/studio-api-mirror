import { ConsumeStrategy, Topic, TopicNameStrategy } from '@ikigaians/queue-pub-sub';
import { KafkaTopicEnum } from '../enums/kafka.enum';

export type StudioTableSwitchPayload = {
  deviceId: string;
};

export const StudioTableSwitchTopic: Topic<StudioTableSwitchPayload> = {
  name: KafkaTopicEnum.STUDIO_TABLE_SWITCH,
  suggestedConsumeStrategy: ConsumeStrategy.BROADCAST,
  suggestedTopicNameStrategy: TopicNameStrategy.DIRECT,
};
