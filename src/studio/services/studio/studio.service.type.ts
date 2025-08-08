export type GetStudioTableQuery = {
  tableId?: string[];
};

export type StudioTableResult = {
  tableId: string;
  tableStatus: string;
};

export type GetStudioTableOutput = {
  tableId: string;
  tableStatus: string;
};

export type GetStudioTableResult = {
  list: GetStudioTableOutput[];
};

export type InsertStudioTableResult = {
  tableId: string;
  tableStatus: string;
};

export type UpdateStudioTableStatusResult = {
  tableId: string;
  tableStatus: string;
};
