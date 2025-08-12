/* eslint-disable @typescript-eslint/no-explicit-any */
export type InsertTableCdnResult = {
  TABLE_ID: string;
  CDN: Record<string, any>;
};

export type UpdateTableCdnEntity = {
  tableId: string;
  cdnDst: Record<string, any>;
};
