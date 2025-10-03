import { StudioTableStatusEnum } from 'src/studio/enums/studio.enums';

export type UpdateStudioTableStatusEntity = {
  tableId: string;
  tableStatus?: string;
  gameId?: string;
};

export type DbStudioResult = {
  tableId: string;
  tableStatus: StudioTableStatusEnum;
  gameId?: string;
};
