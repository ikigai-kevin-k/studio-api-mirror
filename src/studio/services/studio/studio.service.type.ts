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

export type UpdateStudioTableResult = {
  tableId: string;
  tableStatus: string;
};
