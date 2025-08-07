/* eslint-disable @typescript-eslint/no-explicit-any */

export type GetTableCdnQuery = {
  tableId?: string;
};

export type TableCdnResult = {
  cdnDst: Record<string, any>;
};

export type GetTableCdnOutput = {
  tableId: string;
  cdnDst: Record<string, any>;
};

export type UpdateTableCdnOutput = {
  tableId: string;
  cdnDst: Record<string, any>;
};
