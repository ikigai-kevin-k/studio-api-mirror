export type DbStudioGameResult = {
  physicalTableCode: string;
  primaryTableId: string;
  secondaryTableId: string;
  currentTableId: string;
};

export type StudioGameEntity = {
  physicalTableCode: string;
  primaryTableId?: string;
  secondaryTableId?: string;
  currentTableId?: string;
};
