import { ModuleLifecycle } from '@ikigaians/mod';
import { WebClient } from '@slack/web-api';
import { AppConfigService } from 'src/config';
import { LoggerService } from 'src/log';
import { WsService } from 'src/ws/ws.service';
import { Unsubscribe } from 'src/ws/ws.service.type';
import { WebSocket } from 'ws';

export class SlackService implements ModuleLifecycle {
  private client: WebClient | undefined = undefined;

  private unSubscribes: Unsubscribe[] = [];

  constructor(
    private readonly wsService: WsService,
    private readonly logger: LoggerService,
    private readonly appConfigService: AppConfigService,
  ) {}

  async broadcast(message: string) {
    try {
      await this.client?.chat.postMessage({
        channel: this.appConfigService.slackConfig.channel,
        text: `🚨 Exception from  ${this.appConfigService.config.appEnv}`,
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: `🚨 Exception from  ${this.appConfigService.config.appEnv}`,
              emoji: true,
            },
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `\`\`\`\n${message}\n\`\`\``,
            },
          },
        ],
      });
    } catch (error) {
      this.logger.error(error as string);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async onServiceSignal(query: URLSearchParams, ws: WebSocket, data?: any) {
    // eslint-disable-next-line unicorn/no-null
    await this.broadcast(JSON.stringify(data.signal, null, 2));
  }

  async onInit() {
    this.client = new WebClient(this.appConfigService.slackConfig.token);

    this.unSubscribes = [this.wsService.subscribe('exception', this.onServiceSignal.bind(this))];
  }

  async onDispose(): Promise<void> {
    for (const unSubscribe of this.unSubscribes) {
      unSubscribe();
    }
    this.client = undefined;
  }
}
