import { GameCode } from '@ikigaians/type/build/type/lib/';
import { Static, Type } from '@sinclair/typebox';

const GameRequestSchema = Type.Object({
  physicalTableCode: GameCode,
  primaryTableId: Type.Optional(Type.String()),
  secondaryTableId: Type.Optional(Type.String()),
  currentTableId: Type.Optional(Type.String()),
});

const GameResponseSchema = Type.Object({
  physicalTableCode: GameCode,
  primaryTableId: Type.String(),
  secondaryTableId: Type.String(),
  currentTableId: Type.String(),
});

export const GetGameRequest = Type.Object({
  physicalTableCode: Type.String({ minLength: 1, maxLength: 255 }),
});

export type GetGameRequestType = Static<typeof GetGameRequest>;

export const GetGameResponse = GameResponseSchema;

export type GetGameResponseType = Static<typeof GetGameResponse>;

export const InsertGameRequest = GameRequestSchema;

export type InsertGameRequestType = Static<typeof InsertGameRequest>;

export const InsertGameResponse = GameResponseSchema;

export type InsertGameResponseType = Static<typeof InsertGameResponse>;

export const UpdateGameRequest = GameRequestSchema;

export type UpdateGameRequestType = Static<typeof UpdateGameRequest>;

export const UpdateGameResponse = GameResponseSchema;

export type UpdateGameResponseType = Static<typeof UpdateGameResponse>;
