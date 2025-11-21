import { LoggerService } from '@ikigaians/logger';
import { ModuleLifecycle } from '@ikigaians/mod';
import { SlackService } from 'src/slack/slack.service';

import { StudioApiError } from 'src/global/errors/error';
import { StudioDeviceStatusEnum } from 'src/studio/enums/studio.enums';
import { StudioWsAuthError } from 'src/studio/errors/studio.error';
import { StudioErrorSignalService } from 'src/studio/services/studio-error-signal/studio-error-signal.service';
import { StudioTableSwitchService } from 'src/studio/services/studio-table-switch/studio-table-switch.service';
import { WsService } from 'src/ws/ws.service';
import { Unsubscribe, WsInstance } from 'src/ws/ws.service.type';
import { StudioDeviceStatusObserverInput } from './studio-device-status.observer.type';

export class StudioDeviceStatusObserver implements ModuleLifecycle {
  private unSubscribes: Unsubscribe[] = [];
  constructor(
    private readonly studioErrorSignalService: StudioErrorSignalService,
    private readonly studioTableSwitchService: StudioTableSwitchService,
    private readonly slackService: SlackService,
    private readonly wsService: WsService,
    private readonly logger: LoggerService,
  ) {}

  private async onServiceStatus(query: URLSearchParams, ws: WsInstance, data?: object) {
    try {
      const deviceId = query.get('id');
      if (!deviceId) throw new StudioWsAuthError(`Ws connect without device id !!`);

      const input = data as StudioDeviceStatusObserverInput;
      if (!input) throw new StudioWsAuthError(`Ws connect without status info !!`);

      switch (input.status) {
        case StudioDeviceStatusEnum.UP: {
          await this.studioErrorSignalService.forwardResolveSignal(deviceId);
          break;
        }

        case StudioDeviceStatusEnum.DOWN: {
          await this.studioTableSwitchService.publish({ deviceId });
          break;
        }
      }
    } catch (error) {
      const { code, message } = error as StudioApiError;
      const msg = `forward resolve signal to Los and tableApi fail, code: ${code}, reason: ${message}`;
      this.logger.error(msg);
      this.slackService.broadcast(msg);
      ws.error({ message: message, code: code });
    }
  }

  async onInit(): Promise<void> {
    this.unSubscribes = [this.wsService.subscribe('status', this.onServiceStatus.bind(this))];
  }

  async onDispose(): Promise<void> {
    for (const unSubscribe of this.unSubscribes) {
      unSubscribe();
    }
  }
}
