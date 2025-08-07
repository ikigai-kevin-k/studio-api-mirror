import { StudioTableStatusEnum } from '../../enums/studio.enums';

export type UpsertStudioTableResult = {
  TABLE_ID: string;
  TABLE_STATUS: StudioTableStatusEnum;
};

export type UpdateStudioTableEntity = {
  tableId: string;
  tableStatus: StudioTableStatusEnum;
};
