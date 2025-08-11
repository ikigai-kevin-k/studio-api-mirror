/* eslint-disable @typescript-eslint/no-explicit-any */

import { StudioCacheData } from '../studio-cache/studio-cache.service.type';

export type GetTableCdnQuery = {
  tableId?: string;
};

export type TableCdnResult = {
  cdnDst: Record<string, any>;
};

export interface GetTableCdnOutput extends StudioCacheData {
  cdnDst: Record<string, any>;
}

export interface InsertTableCdnOutput extends StudioCacheData {
  cdnDst: Record<string, any>;
}

export interface UpdateTableCdnOutput extends StudioCacheData {
  cdnDst: Record<string, any>;
}
