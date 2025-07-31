import { Static, Type } from '@sinclair/typebox';

export const Healthcheck = Type.Object({
  service: Type.String(),
  environment: Type.String(),
  uptime: Type.Integer(),
  timestamp: Type.Integer(),
  maintenance: Type.Boolean(),
  version: Type.String(),
});

export type HealthcheckType = Static<typeof Healthcheck>;
