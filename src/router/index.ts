import { ModuleProfile } from '@ikigaians/mod';
import { StudioServiceAuthStrategyService } from 'src/auth';
import { InjectionTokensEnum } from 'src/mod/injection-tokens.enum';
import { PreHandlersService } from './pre-handlers/pre-handlers.service';
import { RouterService } from './router.service';

export * from './pre-handlers/pre-handlers.service';
export * from './router.service';

export const RouterModule: ModuleProfile[] = [
  [InjectionTokensEnum.SERVICE_AUTH_STRATEGY, StudioServiceAuthStrategyService],
  [InjectionTokensEnum.PRE_HANDLERS_SERVICE, PreHandlersService],
  [InjectionTokensEnum.ROUTER_SERVICE, RouterService],
];
