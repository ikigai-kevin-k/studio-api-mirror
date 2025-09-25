import { ModuleProfile } from '@ikigaians/mod';
import { InjectionTokensEnum } from 'src/mod/injection-tokens.enum';
import { QaSignalSimulatorController } from 'src/qa/controller/v1/qa-signal-simulator/qa-signal-simulator.controller';

export const QaSimulatorModule: ModuleProfile[] = [
  [InjectionTokensEnum.QA_SIGNAL_SIMULATOR_CONTROLLER, QaSignalSimulatorController],
] as const;
