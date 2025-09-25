import { Static, Type } from '@sinclair/typebox';

export const GetDeviceRequest = Type.Object({
  deviceId: Type.String({ minLength: 1, maxLength: 255 }),
});

export type GetDeviceRequestType = Static<typeof GetDeviceRequest>;

export const GetDeviceResponse = Type.Object({
  deviceId: Type.String(),
  tableId: Type.String(),
});

export type GetDeviceResponseType = Static<typeof GetDeviceResponse>;

export const InsertDeviceRequest = Type.Object({
  deviceId: Type.String(),
  tableId: Type.Optional(Type.String()),
});

export type InsertDeviceRequestType = Static<typeof InsertDeviceRequest>;

export const InsertDeviceResponse = Type.Object({
  deviceId: Type.String(),
  tableId: Type.String(),
});

export type InsertDeviceResponseType = Static<typeof InsertDeviceResponse>;

export const UpdateDeviceRequest = Type.Object({
  deviceId: Type.String(),
  tableId: Type.String(),
});

export type UpdateDeviceRequestType = Static<typeof UpdateDeviceRequest>;

export const UpdateDeviceResponse = Type.Object({
  deviceId: Type.String(),
  tableId: Type.String(),
});

export type UpdateDeviceResponseType = Static<typeof UpdateDeviceResponse>;
