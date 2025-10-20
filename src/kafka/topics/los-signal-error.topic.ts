import { ConsumeStrategy, Topic, TopicNameStrategy } from '@ikigaians/queue-pub-sub';
import { ErrorSignalInput } from 'src/global/types/error-signal.type';
import { KafkaTopicEnum } from '../enums/kafka.enum';

export type LosSignalErrorPayload = ErrorSignalInput;

export const LosSignalErrorTopic: Topic<LosSignalErrorPayload> = {
  name: KafkaTopicEnum.LOS_ERROR_SIGNAL,
  suggestedConsumeStrategy: ConsumeStrategy.BROADCAST,
  suggestedTopicNameStrategy: TopicNameStrategy.DIRECT,
};
