import { ModuleLifecycle } from '@ikigaians/mod';
import { WebClient } from '@slack/web-api';
import { AppConfigService } from 'src/config';
import { LoggerService } from 'src/log';

export class SlackService implements ModuleLifecycle {
  private client: WebClient | undefined = undefined;

  constructor(
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

  async onInit() {
    this.client = new WebClient(this.appConfigService.slackConfig.token);
  }

  async onDispose(): Promise<void> {
    this.client = undefined;
  }
}
