import { ModuleProfile } from '@ikigaians/mod';
import { InjectionTokensEnum } from 'src/mod/injection-tokens.enum';
import { KafkaLosSignalObserver } from './observers/kafka-los-signal/kafka-los-signal.observer';
import { KafkaLosSignalService } from './services/kafka-los-signal/kafka-los-signal.service';
export const KafkaModule: ModuleProfile[] = [
  [InjectionTokensEnum.KAFKA_LOS_SIGNAL_OBSERVER, KafkaLosSignalObserver],
  [InjectionTokensEnum.KAFKA_LOS_SIGNAL_SERVICE, KafkaLosSignalService],
] as const;
