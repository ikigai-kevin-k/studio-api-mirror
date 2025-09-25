import { StudioTableStatusEnum } from '../../enums/studio.enums';

export type StudioTableResult = {
  tableId: string;
  tableStatus: string;
  gameId: string;
};

export type StudioTableSchema = {
  TABLE_ID: string;
  TABLE_STATUS: StudioTableStatusEnum;
  GAME_ID: string;
};

export type UpdateStudioTableStatusEntity = {
  tableStatus?: string;
  gameId?: string;
};
