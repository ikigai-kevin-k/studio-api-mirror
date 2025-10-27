import { ErrorSignalInput, ErrorSignalMetaData } from 'src/global/types/error-signal.type';

export type StudioErrorSignal = ErrorSignalInput;
export type StudioErrorSignalMetaData = ErrorSignalMetaData;

export type DbStudioErrorSignalLog = {
  id: number;
  deviceId: string;
  msgId: string;
  content: string;
  errorSignal: StudioErrorSignalMetaData;
  resolved: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type StudioErrorSignalLogEntity = {
  deviceId: string;
  msgId: string;
  content: string;
  errorSignal: StudioErrorSignalMetaData;
};
