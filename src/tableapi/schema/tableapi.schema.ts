export type TableApiSchema = {
  data: {
    table: {
      gameCode: string;
      gameType: string;
      visibility: string;
      betPeriod: number;
      name: string;
      pause: {
        reason: string;
        createdBy: string;
        createdAt: Date;
        createTime: number;
      };
      maintenance: {
        status: string;
        createTime: number;
        endTime: number;
        startTime: number;
        createdBy: string;
      };
      streams: {
        primary: {
          lo: string;
          me: string;
          hi: string;
          hd: string;
        };
        secondary: {
          lo: string;
          me: string;
          hi: string;
          hd: string;
        };
      };
      autopilot: {
        enable: true;
        resultSequence: [
          {
            roulette: string;
            sicBo: number[];
            baccarat: string[];
          },
        ];
        lastResultIndex: number;
      };
      sdpConfig: {
        additionalProp1: string;
        additionalProp2: string;
        additionalProp3: string;
      };
      tableRound: {
        roundId: string;
        gameCode: string;
        gameType: string;
        betStopTime: Date;
        status: string;
        result: {
          roulette: string;
          sicBo: number[];
          baccarat: string[];
        };
        createdAt: Date;
      };
      metadata: {
        minRoundId: string;
      };
      autoBetStop: boolean;
      createdAt: Date;
      updatedAt: Date;
    };
  };
  error: {
    message: string;
    code: number;
  };
};
