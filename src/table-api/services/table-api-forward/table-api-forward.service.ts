import { getLiveTableSessionHeaders } from '@ikigaians/web';
import { AppConfigService } from 'src/config';
import { send } from 'src/global/utils/send-utils';
import { LoggerService } from 'src/log';
import { TableApiConnectFailureError } from 'src/table-api/errors/table-api.error';
import { TableApiSchema } from 'src/table-api/schema/table-api.schema';
import { fetch } from 'undici';
import { TableApiForwardInput } from './table-api-forward.service.type';

export class TableApiForwardService {
  constructor(
    private readonly appConfigService: AppConfigService,
    private readonly logger: LoggerService,
  ) {}

  async forwardCDN(gameCode: string, data: TableApiForwardInput): Promise<void> {
    await send<TableApiSchema>(
      () => this.updateCDN(gameCode, data),
      this.appConfigService.tableApiConfig.maxRetry,
      this.logger,
    );
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
}
