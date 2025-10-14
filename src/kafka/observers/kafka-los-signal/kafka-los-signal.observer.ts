import { LoggerService } from '@ikigaians/logger';
import { ModuleLifecycle } from '@ikigaians/mod';
import { KafkaDataNotFoundError, KafkaWsAuthFailureError } from 'src/kafka/errors/kafka.error';
import { KafkaLosSignalService } from 'src/kafka/services/kafka-los-signal/kafka-los-signal.service';
import { SlackService } from 'src/slack/slack.service';
import { StudioDeviceDataService } from 'src/studio/services/studio-device/studio-device-data.service';
import { StudioService } from 'src/studio/services/studio/studio.service';

import { StudioApiError } from 'src/global/errors/error';
import { TableApiQueryService } from 'src/table-api/services/table-api-query/table-api-query.service';
import { WsService } from 'src/ws/ws.service';
import { Unsubscribe } from 'src/ws/ws.service.type';
import { WebSocket } from 'ws';
import { KafkaLosSignalObserverInput } from './kafka-los-signal.observer.type';

export class KafkaLosSignalObserver implements ModuleLifecycle {
  private unSubscribes: Unsubscribe[] = [];
  constructor(
    private readonly tableApiQueryService: TableApiQueryService,
    private readonly studioDeviceDataService: StudioDeviceDataService,
    private readonly studioService: StudioService,
    private readonly kafkaLosSignalService: KafkaLosSignalService,
    private readonly slackService: SlackService,
    private readonly wsService: WsService,
    private readonly logger: LoggerService,
  ) {}

  private async onServiceSignal(query: URLSearchParams, ws: WebSocket, data?: object) {
    try {
      const deviceId = query.get('id');
      if (!deviceId) throw new KafkaWsAuthFailureError(`Ws connect without device id !!`);

      const tableId = await this.studioDeviceDataService.getDeviceBelongTo(deviceId);

      const gameId = await this.studioService.getStudioTableBelongTo(tableId);
      if (!gameId) {
        throw new KafkaDataNotFoundError(`[studio] ${tableId} doesn't belong to any GameCode`);
      }

      const name = await this.tableApiQueryService.getTableName(gameId);

      const input = data as KafkaLosSignalObserverInput;
      input.signal.metadata.gameCode = gameId;
      input.signal.metadata.tablename = name;
      await this.kafkaLosSignalService.publish(input.signal);
    } catch (error) {
      const { code, message } = error as StudioApiError;
      const msg = `send error signal to Los through kafka failure, code: ${code}, reason: ${message}`;
      this.logger.error(msg);
      this.slackService.broadcast(msg);
    }
  }

  async onInit(): Promise<void> {
    this.unSubscribes = [this.wsService.subscribe('exception', this.onServiceSignal.bind(this))];
  }

  async onDispose(): Promise<void> {
    for (const unSubscribe of this.unSubscribes) {
      unSubscribe();
    }
  }
}
