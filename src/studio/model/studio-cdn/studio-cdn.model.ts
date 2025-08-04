export type GetTableCdnQuery = {
  tableId?: string;
};

export type TableCdnResult = {
  primaryHd: string;
  primaryHi: string;
  primaryMe: string;
  primaryLo: string;
  secondaryHd: string;
  secondaryHi: string;
  secondaryMe: string;
  secondaryLo: string;
};

export type VideoQuality = {
  lo: string;
  me: string;
  hi: string;
  hd: string;
};

export type TableCdnAppendResult = {
  tableId: string;
};

export type TableCdnPayLoad = {
  primary: VideoQuality;
  secondary: VideoQuality;
};

export type GetTableCdnOutput = TableCdnAppendResult & TableCdnPayLoad;

export type UpdateTableCdnOutput = TableCdnAppendResult & TableCdnPayLoad;
