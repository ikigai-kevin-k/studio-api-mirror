import { ModuleLifecycle } from '@ikigaians/mod';
import { LoggerService } from 'src/log';
import { WsService } from 'src/ws/ws.service';
import { Unsubscribe, WsInstance } from 'src/ws/ws.service.type';
import { SlackSignalData } from './slack.observer.type';
import { SlackService } from './slack.service';

export class SlackObserver implements ModuleLifecycle {
  private unSubscribes: Unsubscribe[] = [];

  constructor(
    private readonly wsService: WsService,
    private readonly slackService: SlackService,
    private readonly logger: LoggerService,
  ) {}

  private async onServiceSignal(query: URLSearchParams, ws: WsInstance, data?: object) {
    if (data)
      await this.slackService.broadcast(
        JSON.stringify((data as SlackSignalData).signal, undefined, 2),
      );
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
