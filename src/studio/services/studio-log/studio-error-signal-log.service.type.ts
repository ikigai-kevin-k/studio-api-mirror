import { ErrorSignalInput } from 'src/global/types/error-signal.type';

export type ErrorSignalLogServiceOutput = {
  id: number;
  deviceId: string;
  errorSignal: ErrorSignalInput;
  resolved: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type GetErrorSignalLogServiceInput = {
  signalId: number;
};

export type InsertErrorSignalLogServiceInput = {
  deviceId: string;
  errorSignal: ErrorSignalInput;
};

export type UpdateErrorSignalLogServiceInput = {
  deviceId: string;
};

export type GetUnResolvedErrorSignalLogServiceInput = {
  deviceId: string;
};
