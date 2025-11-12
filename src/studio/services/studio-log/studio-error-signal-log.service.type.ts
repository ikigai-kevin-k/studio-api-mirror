import { ErrorSignalInput } from 'src/global/types/error-signal.type';
import { DeviceInput } from 'src/global/types/input.type';

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
  limit: number;
};

export type InsertErrorSignalLogServiceInput = {
  deviceId: string;
  errorSignal: ErrorSignalInput;
};

export type UpdateErrorSignalLogServiceInput = DeviceInput;
