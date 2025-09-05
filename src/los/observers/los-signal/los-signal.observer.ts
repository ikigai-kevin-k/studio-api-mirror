import { LoggerService } from '@ikigaians/logger';
import { ModuleLifecycle } from '@ikigaians/mod';
import { AppConfigService } from 'src/config';
import { LosSignalService } from 'src/los/services/los-signal/los-signal.service';
import { WsService } from 'src/ws/ws.service';
import { Unsubscribe } from 'src/ws/ws.service.type';
import { WebSocket } from 'ws';
import { LosSignalObserverInput } from './los-signal.observer.type';

export class LosSignalObserver implements ModuleLifecycle {
  private unSubscribes: Unsubscribe[] = [];
  constructor(
    private readonly wsService: WsService,
    private readonly losSignalService: LosSignalService,
    private readonly appConfigService: AppConfigService,
    private readonly logger: LoggerService,
  ) {}

  private async onServiceSignal(query: URLSearchParams, ws: WebSocket, data?: object) {
    try {
      const tableId = query.get('id');
      if (!tableId) throw new Error('Unknown tableId Exception Signal !!');
      const deviceId = query.get('device') ?? this.appConfigService.amConfig.user;
      const input = data as LosSignalObserverInput;
      const result = await this.losSignalService.updateSignal(tableId, deviceId, input.signal);
      this.logger.info(result);
    } catch (error) {
      const reason = (error as Error).toString();
      this.logger.error(reason);
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
