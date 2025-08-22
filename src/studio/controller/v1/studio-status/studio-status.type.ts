import { StringEnum } from '@ikigaians/common';
import { Static, Type } from '@sinclair/typebox';
import { StudioDeviceStatusEnum, StudioServiceStatusEnum } from 'src/studio/enums/studio.enums';

export const GetTableStatusRequest = Type.Object({
  tableId: Type.String(),
});
export type GetTableStatusRequestType = Static<typeof GetTableStatusRequest>;

export const GetTableStatusResponse = Type.Object({
  tableId: Type.String(),
  uptime: Type.Number(),
  timestamp: Type.Number(),
  maintenance: Type.Boolean(),
  sdp: Type.String(),
  idp: Type.String(),
  broker: Type.String(),
  zCam: Type.String(),
  roulette: Type.String(),
  shaker: Type.String(),
  barcodeScanner: Type.String(),
  nfcScanner: Type.String(),
});

export type GetTableStatusResponseType = Static<typeof GetTableStatusResponse>;

export const InsertTableStatusRequest = Type.Object({
  tableId: Type.String(),
});
export type InsertTableStatusRequestType = Static<typeof InsertTableStatusRequest>;

export const InsertTableStatusResponse = Type.Object({
  tableId: Type.String(),
  uptime: Type.Number(),
  timestamp: Type.Number(),
  maintenance: Type.Boolean(),
  sdp: Type.String(),
  idp: Type.String(),
  broker: Type.String(),
  zCam: Type.String(),
  roulette: Type.String(),
  shaker: Type.String(),
  barcodeScanner: Type.String(),
  nfcScanner: Type.String(),
});

export type InsertTableStatusResponseType = Static<typeof InsertTableStatusResponse>;

export const UpdateTableStatusRequest = Type.Object({
  tableId: Type.String(),
  uptime: Type.Optional(Type.Number()),
  timestamp: Type.Optional(Type.Number()),
  maintenance: Type.Optional(Type.Boolean()),
  sdp: Type.Optional(StringEnum(StudioServiceStatusEnum)),
  idp: Type.Optional(StringEnum(StudioServiceStatusEnum)),
  broker: Type.Optional(StringEnum(StudioDeviceStatusEnum)),
  zCam: Type.Optional(StringEnum(StudioDeviceStatusEnum)),
  roulette: Type.Optional(StringEnum(StudioDeviceStatusEnum)),
  shaker: Type.Optional(StringEnum(StudioDeviceStatusEnum)),
  barcodeScanner: Type.Optional(StringEnum(StudioDeviceStatusEnum)),
  nfcScanner: Type.Optional(StringEnum(StudioDeviceStatusEnum)),
});
export type UpdateTableStatusRequestType = Static<typeof UpdateTableStatusRequest>;

export const UpdateTableStatusResponse = Type.Object({
  tableId: Type.String(),
  uptime: Type.Optional(Type.Number()),
  timestamp: Type.Optional(Type.Number()),
  maintenance: Type.Optional(Type.Boolean()),
  sdp: Type.Optional(Type.String()),
  idp: Type.Optional(Type.String()),
  broker: Type.Optional(Type.String()),
  zCam: Type.Optional(Type.String()),
  roulette: Type.Optional(Type.String()),
  shaker: Type.Optional(Type.String()),
  barcodeScanner: Type.Optional(Type.String()),
  nfcScanner: Type.Optional(Type.String()),
});

export type UpdateTableStatusResponseType = Static<typeof UpdateTableStatusResponse>;
