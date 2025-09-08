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

export interface InsertStudioCdnServiceOutput {
  tableId: string;
  cdnDst: Record<string, StudioCdnSet>;
}

export interface UpdateStudioCdnServiceOutput {
  tableId: string;
  cdnDst: Record<string, StudioCdnSet>;
}
