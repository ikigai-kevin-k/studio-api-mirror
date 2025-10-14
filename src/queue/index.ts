import { ModuleProfile } from '@ikigaians/mod';
import { GlobalKafkaHub } from '@ikigaians/queue-pub-sub';
import { InjectionTokensEnum } from 'src/mod/injection-tokens.enum';
import { GlobalQueueService } from './global-queue.service';

export const QueueModule: ModuleProfile[] = [
  [InjectionTokensEnum.GLOBAL_QUEUE_SERVICE, GlobalQueueService],
  [InjectionTokensEnum.GLOBAL_KAFKA_HUB, GlobalKafkaHub],
] as const;
