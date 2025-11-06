type StudioGameServiceInput = {
  gameId: string;
  primaryTableId?: string;
  secondaryTableId?: string;
  currentTableId?: string;
};

export type StudioGameServiceOutput = {
  gameId: string;
  primaryTableId: string;
  secondaryTableId: string;
  currentTableId: string;
};

export type GetStudioGameServiceInput = {
  gameId: string;
};

export type InsertStudioGameServiceInput = StudioGameServiceInput;

export type UpdateStudioGameServiceInput = StudioGameServiceInput;
