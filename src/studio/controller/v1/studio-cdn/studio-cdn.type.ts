import { Static, Type } from '@sinclair/typebox';

export const CdnList = Type.Object({
  lo: Type.String(),
  me: Type.String(),
  hi: Type.String(),
  hd: Type.String(),
});

export const CdnSet = Type.Object({
  primary: CdnList,
  secondary: CdnList,
});

export const GetStudioTableCdnRequest = Type.Object({
  tableId: Type.String(),
});
export type GetStudioTableCdnRequestType = Static<typeof GetStudioTableCdnRequest>;

export const GetStudioTableCdnResponse = Type.Object({
  tableId: Type.String(),
  cdnDst: CdnSet,
});

export type GetStudioTableCdnResponseType = Static<typeof GetStudioTableCdnResponse>;

export const InsertStudioTableCdnRequest = Type.Object({
  tableId: Type.String(),
  cdnDst: CdnSet,
});

export type InsertStudioTableCdnRequestType = Static<typeof InsertStudioTableCdnRequest>;

export const InsertStudioTableCdnResponse = Type.Object({
  tableId: Type.String(),
  cdnDst: CdnSet,
});

export type InsertStudioTableCdnResponseType = Static<typeof InsertStudioTableCdnResponse>;

export const UpdateStudioTableCdnRequest = Type.Object({
  tableId: Type.String(),
  cdnDst: CdnSet,
});

export type UpdateStudioTableCdnRequestType = Static<typeof UpdateStudioTableCdnRequest>;

export const UpdateStudioTableCdnResponse = Type.Object({
  tableId: Type.String(),
  cdnDst: CdnSet,
});

export type UpdateStudioTableCdnResponseType = Static<typeof UpdateStudioTableCdnResponse>;
