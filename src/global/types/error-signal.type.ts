export type ErrorSignalInput = {
  msgId: string;
  metadata: {
    signalId?: number;
    tableName?: string;
    gameCode?: string;
    title?: string;
    description?: string;
    code?: string;
    suggestion?: string;
    timestamp?: number;
  };
};

export type ActivateBackupInput = object;
