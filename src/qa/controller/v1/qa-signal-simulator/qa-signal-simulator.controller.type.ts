import { StringEnum } from '@ikigaians/common';
import { Static, Type } from '@sinclair/typebox';
import { SystemMessageIdSchema } from 'src/qa/enums/qa-signal.enum';

export const ErrorSignalParams = Type.Object({ gameCode: Type.String() });

export const ErrorSignalBody = Type.Object({
  msgId: StringEnum(SystemMessageIdSchema),
  content: Type.String(),
  metadata: Type.Object({
    locale: Type.Optional(Type.String()),
    timestamp: Type.Optional(Type.Number()),
    gamecode: Type.String(),
    tablename: Type.String(),
    title: Type.String(),
    description: Type.String(),
    code: Type.String(),
    suggestion: Type.String(),
  }),
});

export const ErrorSignalRequest = Type.Object({
  Params: ErrorSignalParams,
  Body: ErrorSignalBody,
});

export type ErrorSignalRequestType = Static<typeof ErrorSignalRequest>;

export const TableApiErrorSignalResponse = Type.Object({
  table: Type.Object({
    gameCode: Type.Optional(Type.String()),
    gameType: Type.Optional(Type.String()),
    visibility: Type.Optional(Type.String()),
    betPeriod: Type.Optional(Type.Number()),
    name: Type.Optional(Type.String()),
    pause: Type.Optional(
      Type.Object({
        reason: Type.Optional(Type.String()),
        createdBy: Type.Optional(Type.String()),
        createdAt: Type.Optional(Type.Date()),
        createTime: Type.Optional(Type.Number()),
      }),
    ),
    maintenance: Type.Optional(
      Type.Object({
        status: Type.Optional(Type.String()),
        createTime: Type.Optional(Type.Number()),
        endTime: Type.Optional(Type.Number()),
        startTime: Type.Optional(Type.Number()),
        createdBy: Type.Optional(Type.String()),
      }),
    ),
    streams: Type.Optional(
      Type.Object({
        primary: Type.Object({
          lo: Type.String(),
          me: Type.String(),
          hi: Type.String(),
          hd: Type.String(),
        }),
        secondary: Type.Object({
          lo: Type.String(),
          me: Type.String(),
          hi: Type.String(),
          hd: Type.String(),
        }),
      }),
    ),
    autopilot: Type.Optional(
      Type.Object({
        enable: Type.Optional(Type.Boolean()),
        resultSequence: Type.Optional(Type.Array(Type.Object({}))),
        lastResultIndex: Type.Optional(Type.Number()),
      }),
    ),
    sdpConfig: Type.Optional(Type.Object({})),
    tableRound: Type.Optional(
      Type.Object({
        roundId: Type.Optional(Type.String()),
        gameCode: Type.Optional(Type.String()),
        gameType: Type.Optional(Type.String()),
        betStopTime: Type.Optional(Type.Date()),
        status: Type.Optional(Type.String()),
        result: Type.Optional(Type.Object({})),
        createdAt: Type.Optional(Type.Date()),
      }),
    ),
    metadata: Type.Optional(Type.Object({})),
    autoBetStop: Type.Optional(Type.Boolean()),
  }),
});

export type TableApiErrorSignalResponseType = Static<typeof TableApiErrorSignalResponse>;

export const KafkaErrorSignalResponse = Type.Object({
  msgId: StringEnum(SystemMessageIdSchema),
  content: Type.String(),
  metadata: Type.Object({
    locale: Type.Optional(Type.String()),
    timestamp: Type.Optional(Type.Number()),
    gamecode: Type.String(),
    tablename: Type.String(),
    title: Type.String(),
    description: Type.String(),
    code: Type.String(),
    suggestion: Type.String(),
  }),
});

export type KafkaErrorSignalResponseType = Static<typeof KafkaErrorSignalResponse>;

export const ActivateBackupParams = Type.Object({ deviceId: Type.String() });
export type ActivateBackupParamsType = Static<typeof ActivateBackupParams>;

export const ActivateBackupResponse = Type.Object({
  gameCode: Type.String(),
  currentTable: Type.String(),
  cdn: Type.Object({
    primary: Type.Object({
      lo: Type.String(),
      me: Type.String(),
      hi: Type.String(),
      hd: Type.String(),
    }),
    secondary: Type.Object({
      lo: Type.String(),
      me: Type.String(),
      hi: Type.String(),
      hd: Type.String(),
    }),
  }),
});
export type ActivateBackupResponseType = Static<typeof ActivateBackupResponse>;
