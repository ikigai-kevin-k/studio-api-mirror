import { KafkaLosSignalServiceInput } from 'src/kafka/services/kafka-los-signal/kafka-los-signal.service.type';

export type KafkaLosSignalObserverInput = {
  signal: KafkaLosSignalServiceInput;
  cmd: object;
};
