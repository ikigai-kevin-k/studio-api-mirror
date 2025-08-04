import { Static, Type } from '@sinclair/typebox';

export const CdnList = Type.Object({
  lo: Type.String(),
  me: Type.String(),
  hi: Type.String(),
  hd: Type.String(),
});

export const GetStudioTableCdnRequest = Type.Object({
  tableId: Type.String(),
});
export type GetStudioTableCdnRequestType = Static<typeof GetStudioTableCdnRequest>;

export const GetStudioTableCdnResponse = Type.Object({
  tableId: Type.String(),
  cdnDST: Type.Object({
    primary: CdnList,
    secondary: CdnList,
  }),
});

export type GetStudioTableCdnResponseType = Static<typeof GetStudioTableCdnResponse>;

export const UpsertStudioTableCdnRequest = Type.Object({
  tableId: Type.String(),
  primary: CdnList,
  secondary: CdnList,
});

export type UpsertStudioTableCdnRequestType = Static<typeof UpsertStudioTableCdnRequest>;

export const UpsertStudioTableCdnResponse = Type.Object({
  tableId: Type.String(),
  primary: CdnList,
  secondary: CdnList,
});

export type UpsertStudioTableCdnResponseType = Static<typeof UpsertStudioTableCdnResponse>;
