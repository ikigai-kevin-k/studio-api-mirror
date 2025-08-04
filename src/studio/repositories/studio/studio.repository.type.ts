import { StudioTableStatusType } from '../../enums/studio.enums';

export type UpsertStudioTableResult = {
  TABLE_ID: string;
  TABLE_STATUS: StudioTableStatusType;
};

export type UpdateStudioTableEntity = {
  tableId: string;
  tableStatus: StudioTableStatusType;
};
