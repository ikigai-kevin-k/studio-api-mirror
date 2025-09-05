import { ModuleProfile } from '@ikigaians/mod';
import { InjectionTokensEnum } from 'src/mod/injection-tokens.enum';
import { LosSignalObserver } from './observers/los-signal/los-signal.observer';
import { LosSignalService } from './services/los-signal/los-signal.service';

export const LosModule: ModuleProfile[] = [
  [InjectionTokensEnum.LOS_SIGNAL_SERVICE, LosSignalService],
  [InjectionTokensEnum.LOS_SIGNAL_OBSERVER, LosSignalObserver],
] as const;
