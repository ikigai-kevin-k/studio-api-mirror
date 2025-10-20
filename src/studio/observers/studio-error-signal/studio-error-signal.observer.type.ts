import { ActivateBackupInput, ErrorSignalInput } from 'src/global/types/error-signal.type';

export type StudioErrorSignalObserverInput = {
  signal: ErrorSignalInput;
  cmd: ActivateBackupInput;
};
