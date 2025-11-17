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
  tableId: Type.String(),
});

const UpsertSchema = Type.Object({
  tableId: Type.String(),
  cdnDst: CdnSet,
});

const ResponseSchema = Type.Object({
  tableId: Type.String(),
  cdnDst: CdnSet,
});

export const GetStudioTableCdnRequest = QuerySchema;
export type GetStudioTableCdnRequestType = Static<typeof GetStudioTableCdnRequest>;
export const GetStudioTableCdnResponse = ResponseSchema;
export type GetStudioTableCdnResponseType = Static<typeof GetStudioTableCdnResponse>;

export const GetStudioTableStreamRequest = QuerySchema;
export type GetStudioTableStreamRequestType = Static<typeof GetStudioTableStreamRequest>;
export const GetStudioTableStreamResponse = ResponseSchema;
export type GetStudioTableStreamResponseType = Static<typeof GetStudioTableStreamResponse>;

export const InsertStudioTableStreamRequest = UpsertSchema;
export type InsertStudioTableStreamRequestType = Static<typeof InsertStudioTableStreamRequest>;
export const InsertStudioTableStreamResponse = ResponseSchema;
export type InsertStudioTableStreamResponseType = Static<typeof InsertStudioTableStreamResponse>;

export const UpdateStudioTableStreamRequest = UpsertSchema;
export type UpdateStudioTableStreamRequestType = Static<typeof UpdateStudioTableStreamRequest>;
export const UpdateStudioTableStreamResponse = ResponseSchema;
export type UpdateStudioTableStreamResponseType = Static<typeof UpdateStudioTableStreamResponse>;
