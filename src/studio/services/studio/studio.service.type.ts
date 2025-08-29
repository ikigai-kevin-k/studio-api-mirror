export interface StudioTableOutput {
  tableId: string;
  tableStatus: string;
}

export type GetStudioTableOutput = {
  list: StudioTableOutput[];
};

export type InsertStudioTableOutput = {
  tableId: string;
  tableStatus: string;
};

export type UpdateStudioTableStatusOutput = {
  tableId: string;
  tableStatus: string;
};
