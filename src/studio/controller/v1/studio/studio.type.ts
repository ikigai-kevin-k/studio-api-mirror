import { StringEnum } from '@ikigaians/common';
import { GameCode } from '@ikigaians/type/build/type/lib/';
import { Static, Type } from '@sinclair/typebox';
import { StudioTableStatusEnum } from 'src/studio/enums/studio.enums';

const StudioTableSchema = Type.Object({
  tableId: Type.String(),
  tableStatus: Type.Optional(StringEnum(StudioTableStatusEnum)),
  gameId: Type.Optional(GameCode),
});

export const GetStudioTableRequest = Type.Object({
  tableId: Type.Optional(Type.Array(Type.String({ minLength: 1, maxLength: 255 }))),
});

export type GetStudioTableRequestType = Static<typeof GetStudioTableRequest>;

export const GetStudioTableResponse = Type.Object({
  list: Type.Array(StudioTableSchema),
});

export type GetStudioTableResponseType = Static<typeof GetStudioTableResponse>;

export const InsertStudioTableRequest = Type.Object({
  tableId: Type.String(),
});

export type InsertStudioTableRequestType = Static<typeof InsertStudioTableRequest>;

export const InsertStudioTableResponse = StudioTableSchema;

export type InsertStudioTableResponseType = Static<typeof InsertStudioTableResponse>;

export const UpdateStudioTableStatusRequest = StudioTableSchema;

export type UpdateStudioTableStatusRequestType = Static<typeof UpdateStudioTableStatusRequest>;

export const UpdateStudioTableStatusResponse = StudioTableSchema;

export type UpdateStudioTableStatusResponseType = Static<typeof UpdateStudioTableStatusResponse>;
