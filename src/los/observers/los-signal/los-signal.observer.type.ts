import { LosSignalServiceInput } from 'src/los/services/los-signal/los-signal.service.type';

export type LosSignalObserverInput = {
  signal: LosSignalServiceInput;
  cmd: object;
};
