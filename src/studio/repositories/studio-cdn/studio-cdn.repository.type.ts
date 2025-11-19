import { CdnSet } from 'src/global/types/cdn.type';

export type TableCdnSet = CdnSet;

export type DbStudioCdnResult = {
  tableId: string;
  cdnDst: Record<string, TableCdnSet>;
};

export type StudioCdnEntity = {
  tableId: string;
  cdnDst: Record<string, TableCdnSet>;
};
