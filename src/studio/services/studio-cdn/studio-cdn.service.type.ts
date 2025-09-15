import { Schema } from 'src/cache/cache.service.type';

interface StudioCdnSet {
  lo: string;
  me: string;
  hi: string;
  hd: string;
}

export interface GetStudioCdnServiceOutput {
  tableId: string;
  cdnDst: Record<string, StudioCdnSet>;
}

export const schema: Schema<GetStudioCdnServiceOutput> = {
  tableId: 'string',
  cdnDst: 'object',
};

export interface InsertStudioCdnServiceOutput {
  tableId: string;
  cdnDst: Record<string, StudioCdnSet>;
}

export interface UpdateStudioCdnServiceOutput {
  tableId: string;
  cdnDst: Record<string, StudioCdnSet>;
}
