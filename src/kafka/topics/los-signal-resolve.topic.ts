import { ConsumeStrategy, Topic, TopicNameStrategy } from '@ikigaians/queue-pub-sub';
import { ResolvedSignalInput } from 'src/global/types/resolve-signal.type';
import { KafkaTopicEnum } from '../enums/kafka.enum';

export type LosSignalResolvePayload = ResolvedSignalInput;

export const LosSignalResolveTopic: Topic<LosSignalResolvePayload> = {
  name: KafkaTopicEnum.LOS_RESOLVE_SIGNAL,
  suggestedConsumeStrategy: ConsumeStrategy.BROADCAST,
  suggestedTopicNameStrategy: TopicNameStrategy.DIRECT,
};
