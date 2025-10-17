import { LoggerService } from '@ikigaians/logger';
import { ModuleLifecycle } from '@ikigaians/mod';
import { SlackService } from 'src/slack/slack.service';

import { StudioApiError } from 'src/global/errors/error';
import { StudioWsAuthError } from 'src/studio/errors/studio.error';
import { StudioErrorSignalService } from 'src/studio/services/studio-error-signal/studio-error-signal.service';
import { WsService } from 'src/ws/ws.service';
import { Unsubscribe } from 'src/ws/ws.service.type';
import { WebSocket } from 'ws';
import { StudioErrorSignalObserverInput } from './studio-error-signal.observer.type';

export class StudioErrorSignalObserver implements ModuleLifecycle {
  private unSubscribes: Unsubscribe[] = [];
  constructor(
    private readonly studioErrorSignalService: StudioErrorSignalService,
    private readonly slackService: SlackService,
    private readonly wsService: WsService,
    private readonly logger: LoggerService,
  ) {}

  private async onServiceSignal(query: URLSearchParams, ws: WebSocket, data?: object) {
    try {
      const deviceId = query.get('id');
      if (!deviceId) throw new StudioWsAuthError(`Ws connect without device id !!`);

      const input = data as StudioErrorSignalObserverInput;
      if (!input) throw new StudioWsAuthError(`Ws connect without error signal !!`);

      const result = await this.studioErrorSignalService.forwardErrorSignal(deviceId, input.signal);
      ws.send(JSON.stringify({ data: result }));
    } catch (error) {
      const { code, message } = error as StudioApiError;
      const msg = `forward error signal to Los and tableApi fail, code: ${code}, reason: ${message}`;
      this.logger.error(msg);
      this.slackService.broadcast(msg);
      ws.send(
        JSON.stringify({
          error: {
            message: message,
            code: code,
          },
        }),
      );
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
