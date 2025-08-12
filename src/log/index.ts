export * from './logger.service';
import { ModuleProfile } from '@ikigaians/mod';
import { InjectionTokensEnum } from 'src/mod/injection-tokens.enum';
import { LoggerService } from './logger.service';

export const LogModule: ModuleProfile[] = [[InjectionTokensEnum.LOGGER, LoggerService]] as const;
