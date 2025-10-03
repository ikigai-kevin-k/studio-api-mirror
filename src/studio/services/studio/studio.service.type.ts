import { Schema } from 'src/cache/cache.service.type';
import { StudioTableStatusEnum } from 'src/studio/enums/studio.enums';

export type StudioServiceOutput = {
  tableId: string;
  tableStatus: string;
  gameId?: string;
};

export const schema: Schema<StudioServiceOutput> = {
  tableId: 'string',
  tableStatus: 'string',
  gameId: 'string',
};

export type GetStudioServiceInput = {
  tableId?: string[];
};

export type GetStudioServiceOutput = {
  list: StudioServiceOutput[];
};

export type InsertStudioServiceInput = {
  tableId: string;
};

export type InsertStudioServiceOutput = {
  tableId: string;
  tableStatus: StudioTableStatusEnum;
  gameId?: string;
};

export type UpdateStudioServiceInput = {
  tableId: string;
  tableStatus?: string;
  gameId?: string;
};

export type UpdateStudioServiceStatusOutput = {
  tableId: string;
  tableStatus?: StudioTableStatusEnum;
  gameId?: string;
};
