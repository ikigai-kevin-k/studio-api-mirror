import { ErrorSignalInput } from 'src/global/types/error-signal.type';

export type StudioErrorSignal = ErrorSignalInput;

export type DbStudioErrorSignalLog = {
  id: number;
  deviceId: string;
  errorSignal: StudioErrorSignal;
  resolved: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type StudioErrorSignalLogEntity = {
  deviceId: string;
  errorSignal: StudioErrorSignal;
};
