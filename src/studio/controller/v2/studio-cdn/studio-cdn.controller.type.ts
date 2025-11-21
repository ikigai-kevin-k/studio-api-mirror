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

const QuerySchema = Type.Object({
  physicalTableCode: Type.String(),
});

const ResponseSchema = Type.Object({
  physicalTableCode: Type.String(),
  cdnDst: CdnSet,
});

export const GetStudioTableCdnRequest = QuerySchema;
export type GetStudioTableCdnRequestType = Static<typeof GetStudioTableCdnRequest>;
export const GetStudioTableCdnResponse = ResponseSchema;
export type GetStudioTableCdnResponseType = Static<typeof GetStudioTableCdnResponse>;
