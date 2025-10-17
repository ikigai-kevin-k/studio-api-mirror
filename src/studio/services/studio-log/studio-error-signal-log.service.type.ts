import { ErrorSignalInput } from 'src/global/types/error-signal.type';
import { DeviceInput, SignalInput } from 'src/global/types/input.type';

export type ErrorSignalLogServiceOutput = {
  id: number;
  deviceId: string;
  errorSignal: ErrorSignalInput;
  resolved: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type GetErrorSignalLogServiceInput = SignalInput;

export type InsertErrorSignalLogServiceInput = {
  deviceId: string;
  errorSignal: ErrorSignalInput;
};

export type UpdateErrorSignalLogServiceInput = DeviceInput;
