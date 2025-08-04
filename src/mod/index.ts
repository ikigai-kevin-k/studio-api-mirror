import { ModuleProfile } from '@ikigaians/mod';
import { AuthModule } from 'src/auth';
import { CacheModule } from 'src/cache';
import { AppConfigService } from 'src/config';
import { DbModule } from 'src/db';
import { HealthcheckModule } from 'src/healthcheck';
import { LogModule } from 'src/log';
import { RouterModule } from 'src/router';
import { StudioModule } from 'src/studio';
import { InjectionTokensEnum } from './injection-tokens.enum';

export const StudioMod: ModuleProfile[] = [
  [InjectionTokensEnum.APP_CONFIG_SERVICE, AppConfigService],
  ...DbModule,
  ...CacheModule,
  ...AuthModule,
  ...RouterModule,
  ...HealthcheckModule,
  ...LogModule,
  ...StudioModule,
];
