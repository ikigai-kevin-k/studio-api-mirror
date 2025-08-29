import { StudioTableStatusEnum } from '../../enums/studio.enums';

export type StudioTableResult = {
  tableId: string;
  tableStatus: string;
};

export type GetStudioTableQuery = {
  tableId?: string[];
};

export type InsertStudioTableResult = {
  TABLE_ID: string;
  TABLE_STATUS: StudioTableStatusEnum;
};

export type UpdateStudioTableStatusEntity = {
  tableId: string;
  tableStatus: string;
};
