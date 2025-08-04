import { ModuleProfile } from '@ikigaians/mod';
import { InjectionTokensEnum } from 'src/mod/injection-tokens.enum';
import { StudioCdnController } from './controller/v1/studio-cdn/studio-cdn.controller';
import { StudioController } from './controller/v1/studio/studio.controller';
import { StudioCacheRepository } from './repositories/studio-cache/studio-cache.repository';
import { StudioCdnRepository } from './repositories/studio-cdn/studio-cdn.repository';
import { StudioRepository } from './repositories/studio/studio.repository';
import { StudioCacheService } from './services/studio-cache/studio-cache.service';
import { StudioCdnService } from './services/studio-cdn/studio-cdn.service';
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
] as const;
