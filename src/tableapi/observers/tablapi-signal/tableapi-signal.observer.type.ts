import { TableApiSignalServiceInput } from 'src/tableapi/services/tableapi-signal/tableapi-signal.service.type';

export type TableApiSignalObserverInput = {
  signal: TableApiSignalServiceInput;
  cmd: object;
};
