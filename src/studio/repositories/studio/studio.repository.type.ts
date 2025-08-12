import { StudioTableStatusEnum } from '../../enums/studio.enums';

export type InsertStudioTableResult = {
  TABLE_ID: string;
  TABLE_STATUS: StudioTableStatusEnum;
};

export type UpdateStudioTableStatusEntity = {
  tableId: string;
  tableStatus: string;
};
