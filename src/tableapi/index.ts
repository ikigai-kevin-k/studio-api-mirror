import { ModuleProfile } from '@ikigaians/mod';
import { InjectionTokensEnum } from 'src/mod/injection-tokens.enum';
import { TableApiSignalObserver } from 'src/tableapi/observers/tablapi-signal/tableapi-signal.observer';
import { TableApiCdnService } from 'src/tableapi/services/tableapi-cdn/tableapi-cdn.service';
import { TableApiSignalService } from 'src/tableapi/services/tableapi-signal/tableapi-signal.service';
import { TableApiTableService } from './services/tableapi-table/tableapi-table.service';

export const TableApiModule: ModuleProfile[] = [
  [InjectionTokensEnum.TABLE_API_TABLE_SERVICE, TableApiTableService],
  [InjectionTokensEnum.TABLE_API_CDN_SERVICE, TableApiCdnService],
  [InjectionTokensEnum.TABLE_API_SIGNAL_SERVICE, TableApiSignalService],
  [InjectionTokensEnum.TABLE_API_SIGNAL_OBSERVER, TableApiSignalObserver],
] as const;
