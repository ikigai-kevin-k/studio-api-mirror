export type KafkaLosSignalServiceInput = {
  msgId: string;
  metadata: {
    gameCode: string;
    tablename: string;
    title: string;
    description: string;
    code: string;
    suggestion: string;
  };
};
