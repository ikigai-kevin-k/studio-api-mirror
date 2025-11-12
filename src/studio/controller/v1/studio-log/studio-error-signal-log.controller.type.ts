import { Static, Type } from '@sinclair/typebox';

const ErrorSignalLogResponseSchema = Type.Object({
  id: Type.Number(),
  deviceId: Type.String(),
  errorSignal: Type.Any(),
  resolved: Type.Boolean(),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
});

export const GetStudioErrorSignalRequest = Type.Object({
  signalId: Type.Number(),
  limit: Type.Number({ minimum: 1 }),
});

export type GetStudioErrorSignalRequestType = Static<typeof GetStudioErrorSignalRequest>;

export const GetStudioErrorSignalResponse = Type.Array(ErrorSignalLogResponseSchema);

export type GetStudioErrorSignalResponseType = Static<typeof GetStudioErrorSignalResponse>;
