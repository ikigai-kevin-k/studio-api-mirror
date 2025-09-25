import { ModuleLifecycle } from '@ikigaians/mod';
import { getLiveTableSessionHeaders } from '@ikigaians/web';
import { AppConfigService } from 'src/config';
import { LoggerService } from 'src/log';
import { TableApiConnectFailureError } from 'src/table-api/errors/table-api.error';
import { TableApiSchema } from 'src/table-api/schema/table-api.schema';
import { send } from 'src/utils/send-utils';
import { fetch } from 'undici';
import { TableApiCdnServiceInput } from './table-api-cdn.type';

export class TableApiCdnService implements ModuleLifecycle {
  constructor(
    private readonly appConfigService: AppConfigService,
    private readonly logger: LoggerService,
  ) {}

  private async sendCDN(gameCode: string, data: TableApiCdnServiceInput): Promise<TableApiSchema> {
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
        `[PATCH] ${resp.url} failure ! status: ${resp.status}, code: ${result.error.code}, message: ${result.error.message}`,
      );
    }
    this.logger.info(`[PATCH] ${resp.url} result = ${JSON.stringify(result)}`);
    return result;
  }

  async forwardCDN(gameCode: string, data: TableApiCdnServiceInput) {
    try {
      await send(
        () => this.sendCDN(gameCode, data),
        this.appConfigService.tableApiConfig.maxRetry,
        this.logger,
      );
    } catch (error) {
      const reason = (error as Error).message;
      throw new TableApiConnectFailureError(reason);
    }
  }

  async onInit() {}

  async onDispose(): Promise<void> {}
}
