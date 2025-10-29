export type ErrorSignalMetaData = {
  signalId?: number;
  tableName?: string;
  gameCode?: string;
  title?: string;
  description?: string;
  code?: string;
  suggestion?: string;
  timestamp?: number;
};

export type ErrorSignalInput = {
  msgId: string;
  content: string;
  metadata: ErrorSignalMetaData;
};

export type ActivateBackupInput = object;
