import { ModuleProfile } from '@ikigaians/mod';
import { InjectionTokensEnum } from 'src/mod/injection-tokens.enum';
import { StudioServiceAuthStrategyService } from './service-auth-strategy.service';

export * from './service-auth-strategy.service';

export const AuthModule: ModuleProfile[] = [
  [InjectionTokensEnum.SERVICE_AUTH_STRATEGY, StudioServiceAuthStrategyService],
] as const;
