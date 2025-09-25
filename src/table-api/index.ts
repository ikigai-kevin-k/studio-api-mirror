import { ModuleProfile } from '@ikigaians/mod';
import { InjectionTokensEnum } from 'src/mod/injection-tokens.enum';
import { TableApiSignalObserver } from 'src/table-api/observers/table-api-signal/table-api-signal.observer';
import { TableApiCdnService } from 'src/table-api/services/table-api-cdn/table-api-cdn.service';
import { TableApiSignalService } from 'src/table-api/services/table-api-signal/table-api-signal.service';
import { TableApiTableService } from './services/table-api-table/table-api-table.service';

export const TableApiModule: ModuleProfile[] = [
  [InjectionTokensEnum.TABLE_API_TABLE_SERVICE, TableApiTableService],
  [InjectionTokensEnum.TABLE_API_CDN_SERVICE, TableApiCdnService],
  [InjectionTokensEnum.TABLE_API_SIGNAL_SERVICE, TableApiSignalService],
  [InjectionTokensEnum.TABLE_API_SIGNAL_OBSERVER, TableApiSignalObserver],
] as const;
