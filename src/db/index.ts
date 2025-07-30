import { ModuleProfile } from '@ikigaians/mod';
import { InjectionTokensEnum } from 'src/mod/injection-tokens.enum';
import { DbLoggerService } from './db-logger/db-logger.service';
import { DbService } from './db.service';

export * from './db.service';

export const DbModule: ModuleProfile[] = [
  [InjectionTokensEnum.DB_LOGGER_SERVICE, DbLoggerService],
  [InjectionTokensEnum.DB_SERVICE, DbService],
] as const;
