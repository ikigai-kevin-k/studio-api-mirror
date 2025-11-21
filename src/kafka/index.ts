import { ModuleProfile } from '@ikigaians/mod';
import { InjectionTokensEnum } from 'src/mod/injection-tokens.enum';
import { KafkaLosSignalService } from './services/kafka-los-signal/kafka-los-signal.service';
import { KafkaStudioSwitchService } from './services/kafka-studio-switch/kafka-studio-switch.service';
export const KafkaModule: ModuleProfile[] = [
  [InjectionTokensEnum.KAFKA_LOS_SIGNAL_SERVICE, KafkaLosSignalService],
  [InjectionTokensEnum.KAFKA_STUDIO_SWITCH_SERVICE, KafkaStudioSwitchService],
] as const;
