export interface StudioServiceOutput {
  tableId: string;
  tableStatus: string;
}

export type GetStudioServiceOutput = {
  list: StudioServiceOutput[];
};

export type InsertStudioServiceOutput = {
  tableId: string;
  tableStatus: string;
};

export type UpdateStudioServiceStatusOutput = {
  tableId: string;
  tableStatus: string;
};
