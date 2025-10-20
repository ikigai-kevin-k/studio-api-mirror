import { ModuleProfile } from '@ikigaians/mod';
import { InjectionTokensEnum } from 'src/mod/injection-tokens.enum';
import { TableApiSignalService } from 'src/table-api/services/table-api-signal/table-api-signal.service';
import { TableApiQueryService } from './services/table-api-query/table-api-query.service';

export const TableApiModule: ModuleProfile[] = [
  [InjectionTokensEnum.TABLE_API_QUERY_SERVICE, TableApiQueryService],
  [InjectionTokensEnum.TABLE_API_SIGNAL_SERVICE, TableApiSignalService],
] as const;
