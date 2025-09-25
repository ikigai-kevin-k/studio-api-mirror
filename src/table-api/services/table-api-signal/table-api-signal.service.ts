import { ModuleLifecycle } from '@ikigaians/mod';
import { getLiveTableSessionHeaders } from '@ikigaians/web';
import { AppConfigService } from 'src/config';
import { LoggerService } from 'src/log';
import {
  ErrorSignalRequestType,
  TableApiErrorSignalResponseType,
} from 'src/qa/controller/v1/qa-signal-simulator/qa-signal-simulator.controller.type';
import { TableApiConnectFailureError } from 'src/table-api/errors/table-api.error';
import { TableApiSchema } from 'src/table-api/schema/table-api.schema';
import { send } from 'src/utils/send-utils';
import { fetch } from 'undici';
import { TableApiSignalServiceInput } from './table-api-signal.service.type';

export class TableApiSignalService implements ModuleLifecycle {
  constructor(
    private readonly appConfigService: AppConfigService,
    private readonly logger: LoggerService,
  ) {}

  private async sendSignal(
    gameCode: string,
    data: TableApiSignalServiceInput,
  ): Promise<TableApiSchema> {
    const requestJson = JSON.stringify(data);
    const resp = await fetch(
      `${this.appConfigService.tableApiConfig.url}/v2/service/tables/${gameCode}/broadcast`,
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          ...(getLiveTableSessionHeaders() as { Cookie: string }),
        },
        body: requestJson,
      },
    );

    const result = (await resp.json()) as TableApiSchema;
    if (!resp.ok || result.error) {
      throw new TableApiConnectFailureError(
        `[POST] ${resp.url} failure ! status: ${resp.status}, code: ${result.error.code}, message: ${result.error.message}`,
      );
    }
    this.logger.info(`[POST] ${resp.url} result = ${JSON.stringify(result)}`);
    return result;
  }

  async forwardSignal(gameCode: string, data: TableApiSignalServiceInput): Promise<TableApiSchema> {
    const resp = await send<TableApiSchema>(
      () => this.sendSignal(gameCode, data),
      this.appConfigService.tableApiConfig.maxRetry,
      this.logger,
    );
    return resp;
  }

  async forwardSignalByApi(
    request: ErrorSignalRequestType,
  ): Promise<TableApiErrorSignalResponseType> {
    const gameCode = request.Params.gameCode;
    const input: TableApiSignalServiceInput = {
      msgId: request.Body.msgId,
      content: request.Body.content,
      metadata: request.Body.metadata,
    };

    try {
      const resp = await send<TableApiSchema>(
        () => this.sendSignal(gameCode, input),
        this.appConfigService.tableApiConfig.maxRetry,
        this.logger,
      );
      return {
        table: resp.data.table,
      };
    } catch (error) {
      const reason = (error as Error).message;
      throw new TableApiConnectFailureError(reason);
    }
  }

  async onInit() {}
}
