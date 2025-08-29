import { ModuleProfile } from '@ikigaians/mod';
import { InjectionTokensEnum } from 'src/mod/injection-tokens.enum';
import { LosCdnService } from './services/los-cdn/los-cdn.service';
import { LosSignalService } from './services/los-signal/los-signal.service';

export const LosModule: ModuleProfile[] = [
  [InjectionTokensEnum.LOS_SIGNAL_SERVICE, LosSignalService],
  [InjectionTokensEnum.LOS_CDN_SERVICE, LosCdnService],
] as const;
