import { Schema } from 'src/cache/cache.service.type';

export interface StudioServiceOutput {
  tableId: string;
  tableStatus: string;
  gameId: string;
}

export const schema: Schema<StudioServiceOutput> = {
  tableId: 'string',
  tableStatus: 'string',
  gameId: 'string',
};

export type GetStudioServiceOutput = {
  list: StudioServiceOutput[];
};

export type InsertStudioServiceOutput = {
  tableId: string;
  tableStatus: string;
  gameId: string;
};

export type UpdateStudioServiceStatusOutput = {
  tableId: string;
  tableStatus?: string;
  gameId?: string;
};
