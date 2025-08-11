import { StudioCacheData } from '../studio-cache/studio-cache.service.type';

export type GetStudioTableQuery = {
  tableId?: string[];
};

export type StudioTableResult = {
  tableId: string;
  tableStatus: string;
};

export interface GetStudioTableOutput extends StudioCacheData {
  tableStatus: string;
}

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
