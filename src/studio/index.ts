import { ModuleProfile } from '@ikigaians/mod';
import { InjectionTokensEnum } from 'src/mod/injection-tokens.enum';
import { StudioCdnController } from './controller/v1/studio-cdn/studio-cdn.controller';
import { StudioStatusController } from './controller/v1/studio-status/studio-status.controller';
import { StudioController } from './controller/v1/studio/studio.controller';
import { StudioCacheRepository } from './repositories/studio-cache/studio-cache.repository';
import { StudioCdnRepository } from './repositories/studio-cdn/studio-cdn.repository';
import { StudioStatusRepository } from './repositories/studio-status/studio-status.repository';
import { StudioRepository } from './repositories/studio/studio.repository';
import { StudioCacheService } from './services/studio-cache/studio-cache.service';
import { StudioCdnService } from './services/studio-cdn/studio-cdn.service';
import { StudioStatusService } from './services/studio-status/studio-status.service';
import { StudioWsService } from './services/studio-ws/studio-ws.service';
import { StudioService } from './services/studio/studio.service';
export const StudioModule: ModuleProfile[] = [
  [InjectionTokensEnum.STUDIO_CACHE_REPOSITORY, StudioCacheRepository],
  [InjectionTokensEnum.STUDIO_CACHE_SERVICE, StudioCacheService],

  [InjectionTokensEnum.STUDIO_REPOSITORY, StudioRepository],
  [InjectionTokensEnum.STUDIO_SERVICE, StudioService],
  [InjectionTokensEnum.STUDIO_CONTROLLER, StudioController],

  [InjectionTokensEnum.STUDIO_CDN_REPOSITORY, StudioCdnRepository],
  [InjectionTokensEnum.STUDIO_CDN_SERVICE, StudioCdnService],
  [InjectionTokensEnum.STUDIO_CDN_CONTROLLER, StudioCdnController],

  [InjectionTokensEnum.STUDIO_STATUS_REPOSITORY, StudioStatusRepository],
  [InjectionTokensEnum.STUDIO_STATUS_SERVICE, StudioStatusService],
  [InjectionTokensEnum.STUDIO_STATUS_CONTROLLER, StudioStatusController],

  [InjectionTokensEnum.STUDIO_WS_SERVICE, StudioWsService],
] as const;
