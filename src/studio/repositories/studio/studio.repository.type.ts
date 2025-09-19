import { StudioTableStatusEnum } from '../../enums/studio.enums';

export type StudioTableResult = {
  tableId: string;
  tableStatus: string;
};

export type StudioTableSchema = {
  TABLE_ID: string;
  TABLE_STATUS: StudioTableStatusEnum;
};

export type UpdateStudioTableStatusEntity = {
  tableId: string;
  tableStatus: string;
};
