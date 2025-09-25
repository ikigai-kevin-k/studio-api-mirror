import { ModuleLifecycle } from '@ikigaians/mod';
import { LoggerService } from 'src/log';
import { SlackService } from 'src/slack/slack.service';
import { StudioNotFoundError, StudioWsAuthError } from 'src/studio/errors/studio.error';
import { StudioDeviceDataService } from 'src/studio/services/studio-device/studio-device-data.service';
import { StudioService } from 'src/studio/services/studio/studio.service';
import { TableApiSignalService } from 'src/tableapi/services/tableapi-signal/tableapi-signal.service';
import { StudioApiError } from 'src/utils/error-utils';
import { WsService } from 'src/ws/ws.service';
import { Unsubscribe } from 'src/ws/ws.service.type';
import { WebSocket } from 'ws';
import { TableApiSignalObserverInput } from './tableapi-signal.observer.type';

export class TableApiSignalObserver implements ModuleLifecycle {
  private unSubscribes: Unsubscribe[] = [];
  constructor(
    private readonly wsService: WsService,
    private readonly tableApiSignalService: TableApiSignalService,
    private readonly studioDeviceDataService: StudioDeviceDataService,
    private readonly studioService: StudioService,
    private readonly slackService: SlackService,
    private readonly logger: LoggerService,
  ) {}

  private async onServiceSignal(query: URLSearchParams, ws: WebSocket, data?: object) {
    try {
      // Scenario 6 : Received An Error Signal From The Device (Forward to TableApi)
      // https://ikigaians.atlassian.net/wiki/spaces/ST/pages/862388253/Studio+API+Workflow#Scenario-6-%3A-Received-An-Error-Signal-From-The-Device-(Forward-to-TableApi)
      const deviceId = query.get('id');
      if (!deviceId) throw new StudioWsAuthError('Unknown deviceId Exception Signal !!');

      const tableId = await this.studioDeviceDataService.getDeviceBelongTo(deviceId);
      if (!tableId)
        throw new StudioNotFoundError(`Device ${deviceId} doesn't belong to any table !!`);

      const gameCode = await this.studioService.getStudioTableBelongTo(tableId);
      if (!gameCode)
        throw new StudioNotFoundError(`Table ${tableId} doesn't belong to any game !!`);

      const input = data as TableApiSignalObserverInput;
      await this.tableApiSignalService.forwardSignal(gameCode, input.signal);
    } catch (error) {
      const { code, message } = error as StudioApiError;
      const msg = `send error signal to TableApi failure, code: ${code}, reason: ${message}`;
      this.logger.error(msg);
      this.slackService.broadcast(msg);
    }
  }

  async onInit() {
    this.unSubscribes = [this.wsService.subscribe('exception', this.onServiceSignal.bind(this))];
  }

  async onDispose(): Promise<void> {
    for (const unSubscribe of this.unSubscribes) {
      unSubscribe();
    }
  }
}
