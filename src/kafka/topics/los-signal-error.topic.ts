import { ConsumeStrategy, Topic, TopicNameStrategy } from '@ikigaians/queue-pub-sub';

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

export const TopicLosSignalError: Topic<LosSignalErrorPayload> = {
  name: process.env.KAFKA_TOPIC_LOS_SIGNAL_ERROR || 'studio.signals.errors',
  suggestedConsumeStrategy: ConsumeStrategy.BROADCAST,
  suggestedTopicNameStrategy: TopicNameStrategy.DIRECT,
};
