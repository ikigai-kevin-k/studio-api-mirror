import { Static, Type } from '@sinclair/typebox';

export const UnauthorizedResponse = Type.Object({
  message: Type.Literal('Unauthorized'),
});

export type UnauthorizedResponseType = Static<typeof UnauthorizedResponse>;

export const NotFoundResponse = Type.Object({
  message: Type.Literal('Not found'),
  code: Type.String(),
});

export type NotFoundResponseType = Static<typeof NotFoundResponse>;

export const BadRequestResponse = Type.Object({
  message: Type.String(),
  code: Type.String(),
});

export type BadRequestResponseType = Static<typeof BadRequestResponse>;

export const ServiceUnavailableResponse = Type.Object({
  message: Type.String(),
  code: Type.String(),
});

export type ServiceUnavailableResponseType = Static<typeof ServiceUnavailableResponse>;
