import { getLiveTableSessionHeaders } from '@ikigaians/web';
import { AppConfigService } from 'src/config';
import { StudioApiError } from 'src/global/errors/error';
import { send } from 'src/global/utils/send-utils';
import { LoggerService } from 'src/log';
import { SlackService } from 'src/slack/slack.service';
import { StudioNotFoundError } from 'src/studio/errors/studio.error';
import { StudioGameService } from 'src/studio/services/studio-game/studio-game.service';
import { StudioService } from 'src/studio/services/studio/studio.service';
import { TableApiConnectFailureError } from 'src/table-api/errors/table-api.error';
import { TableApiSchema } from 'src/table-api/schema/table-api.schema';
import { fetch } from 'undici';
import { TableApiForwardInput } from './table-api-forward.service.type';

export class TableApiForwardService {
  constructor(
    private readonly studioService: StudioService,
    private readonly studioGameService: StudioGameService,
    private readonly appConfigService: AppConfigService,
    private readonly slackService: SlackService,
    private readonly logger: LoggerService,
  ) {}

  async forwardCDN(tableCode: string, data: TableApiForwardInput): Promise<void> {
    try {
      const gameCode = await this.queryForwardGameCode(tableCode);
      if (!gameCode) return;

      await send<TableApiSchema>(
        () => this.updateCDN(gameCode, data),
        this.appConfigService.tableApiConfig.maxRetry,
        this.logger,
      );
    } catch (error) {
      const { code, message } = error as StudioApiError;
      const msg = `forward stream cdn to tableApi fail, code: ${code}, reason: ${message}`;
      this.logger.error(msg);
      this.slackService.broadcast(msg);
    }
  }

  private async updateCDN(gameCode: string, data: TableApiForwardInput): Promise<TableApiSchema> {
    const resp = await fetch(
      `${this.appConfigService.tableApiConfig.url}/v2/service/tables/${gameCode}`,
      {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json',
          ...(getLiveTableSessionHeaders() as { Cookie: string }),
        },
        body: JSON.stringify({ streams: data }),
      },
    );

    const result = (await resp.json()) as TableApiSchema;
    if (!resp.ok || result.error) {
      throw new TableApiConnectFailureError(
        `[PATCH] ${resp.url} failure ! status: ${resp.status}, code: ${result.error?.code ?? 'unknown'}, message: ${result.error?.message ?? 'No error message provided'}`,
      );
    }
    this.logger.info(`[PATCH] ${resp.url} result = ${JSON.stringify(result)}`);
    return result;
  }

  private async queryForwardGameCode(tableCode: string) {
    const physicalTableCode = await this.studioService.getStudioTableBelongTo(tableCode);
    if (!physicalTableCode) {
      throw new StudioNotFoundError(`tableCode ${tableCode} does not belong to any gameCode`);
    }

    const game = await this.studioGameService.getGame({ physicalTableCode: physicalTableCode });
    return game.currentTableId === tableCode ? physicalTableCode : '';
  }
}
