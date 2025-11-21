import { CdnSet } from 'src/global/types/cdn.type';

type StudioCdnSet = CdnSet;

export type StudioCdnServiceOutput = {
  tableId: string;
  cdnDst: Record<string, StudioCdnSet>;
};

export type GetStudioCdnServiceInput = {
  tableId: string;
};

export type InsertStudioCdnServiceInput = {
  tableId: string;
  cdnDst: Record<string, StudioCdnSet>;
};

export type UpdateStudioCdnServiceInput = {
  tableId: string;
  cdnDst: Record<string, StudioCdnSet>;
};
