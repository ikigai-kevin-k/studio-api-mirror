import { TableApiSignalServiceInput } from 'src/table-api/services/table-api-signal/table-api-signal.service.type';

export type TableApiSignalObserverInput = {
  signal: TableApiSignalServiceInput;
  cmd: object;
};
