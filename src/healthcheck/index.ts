import { ModuleProfile } from '@ikigaians/mod';
import { InjectionTokensEnum } from 'src/mod/injection-tokens.enum';
import { HealthcheckController } from './healthcheck.controller';
import { HealthcheckService } from './healthcheck.service';

export * from './healthcheck.controller';
export * from './healthcheck.dto';
export * from './healthcheck.service';

export const HealthcheckModule: ModuleProfile[] = [
  [InjectionTokensEnum.HEALTHCHECK_SERVICE, HealthcheckService],
  [InjectionTokensEnum.HEALTHCHECK_CONTROLLER, HealthcheckController],
] as const;
