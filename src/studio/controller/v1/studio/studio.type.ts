import { StringEnum } from '@ikigaians/common';
import { Static, Type } from '@sinclair/typebox';
import { StudioTableStatusEnum } from 'src/studio/enums/studio.enums';

export const GetStudioTableRequest = Type.Object({
  tableId: Type.Optional(Type.Array(Type.String({ minLength: 1, maxLength: 255 }))),
});

export type GetStudioTableRequestType = Static<typeof GetStudioTableRequest>;

export const GetStudioTableResponse = Type.Object({
  list: Type.Array(
    Type.Object({
      tableId: Type.String(),
      tableStatus: Type.String(),
      gameId: Type.String(),
    }),
  ),
});

export type GetStudioTableResponseType = Static<typeof GetStudioTableResponse>;

export const InsertStudioTableRequest = Type.Object({
  tableId: Type.String(),
  tableStatus: Type.Optional(StringEnum(StudioTableStatusEnum)),
  gameId: Type.Optional(Type.String()),
});

export type InsertStudioTableRequestType = Static<typeof InsertStudioTableRequest>;

export const InsertStudioTableResponse = Type.Object({
  tableId: Type.String(),
  tableStatus: Type.String(),
  gameId: Type.String(),
});

export type InsertStudioTableResponseType = Static<typeof InsertStudioTableResponse>;

export const UpdateStudioTableStatusRequest = Type.Object({
  tableId: Type.String(),
  tableStatus: Type.Optional(StringEnum(StudioTableStatusEnum)),
  gameId: Type.Optional(Type.String()),
});

export type UpdateStudioTableStatusRequestType = Static<typeof UpdateStudioTableStatusRequest>;

export const UpdateStudioTableStatusResponse = Type.Object({
  tableId: Type.String(),
  tableStatus: Type.Optional(Type.String()),
  gameId: Type.Optional(Type.String()),
});

export type UpdateStudioTableStatusResponseType = Static<typeof UpdateStudioTableStatusResponse>;
