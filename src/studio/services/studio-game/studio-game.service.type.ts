type StudioGameServiceInput = {
  physicalTableCode: string;
  primaryTableId?: string;
  secondaryTableId?: string;
  currentTableId?: string;
};

export type StudioGameServiceOutput = {
  physicalTableCode: string;
  primaryTableId: string;
  secondaryTableId: string;
  currentTableId: string;
};

export type GetStudioGameServiceInput = {
  physicalTableCode: string;
};

export type InsertStudioGameServiceInput = StudioGameServiceInput;

export type UpdateStudioGameServiceInput = StudioGameServiceInput;
