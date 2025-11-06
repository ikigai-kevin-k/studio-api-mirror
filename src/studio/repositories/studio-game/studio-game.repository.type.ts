export type DbStudioGameResult = {
  gameId: string;
  primaryTableId: string;
  secondaryTableId: string;
  currentTableId: string;
};

export type StudioGameEntity = {
  gameId: string;
  primaryTableId?: string;
  secondaryTableId?: string;
  currentTableId?: string;
};
