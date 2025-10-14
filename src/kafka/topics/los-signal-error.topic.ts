import { ConsumeStrategy, Topic, TopicNameStrategy } from '@ikigaians/queue-pub-sub';
import { KafkaTopicEnum } from '../enums/kafka.enum';

export type LosSignalErrorPayload = {
  msgId: string;
  metadata: {
    gameCode: string;
    tablename: string;
    title: string;
    description: string;
    code: string;
    suggestion: string;
  };
};

export const LosSignalErrorTopic: Topic<LosSignalErrorPayload> = {
  name: KafkaTopicEnum.LOS_ERROR_SIGNAL,
  suggestedConsumeStrategy: ConsumeStrategy.BROADCAST,
  suggestedTopicNameStrategy: TopicNameStrategy.DIRECT,
};
