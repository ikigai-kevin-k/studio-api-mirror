export type ErrorSignalMetaData = {
  signalId?: number;
  tableName?: string;
  gameCode?: string;
  title?: string;
  description?: string;
  code?: string;
  suggestion?: string;
  timestamp?: number;
  signalType?: 'error' | 'warning';
  tableCode?: string;
};

export type ErrorSignalInput = {
  msgId: string;
  content: string;
  metadata: ErrorSignalMetaData;
};

export type ActivateBackupInput = object;
