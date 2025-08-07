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
    }),
  ),
});

export type GetStudioTableResponseType = Static<typeof GetStudioTableResponse>;

export const UpsertStudioTableRequest = Type.Object({
  tableId: Type.String(),
  tableStatus: StringEnum(StudioTableStatusEnum),
});

export type UpsertStudioTableRequestType = Static<typeof UpsertStudioTableRequest>;

export const UpsertStudioTableResponse = Type.Object({
  tableId: Type.String(),
  tableStatus: Type.String(),
});

export type UpsertStudioTableResponseType = Static<typeof UpsertStudioTableResponse>;
