interface TableCdnSet {
  lo: string;
  me: string;
  hi: string;
  hd: string;
}

export type GetTableCdnResult = {
  tableId: string;
  cdnDst: Record<string, TableCdnSet>;
};

export type InsertTableCdnResult = {
  TABLE_ID: string;
  CDN: Record<string, TableCdnSet>;
};

export type UpdateTableCdnEntity = {
  tableId: string;
  cdnDst: Record<string, TableCdnSet>;
};
