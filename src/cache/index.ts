import { ModuleProfile } from '@ikigaians/mod';
import { InjectionTokensEnum } from 'src/mod/injection-tokens.enum';
import { CacheService } from './cache.service';

export const CacheModule: ModuleProfile[] = [[InjectionTokensEnum.CACHE_SERVICE, CacheService]];
