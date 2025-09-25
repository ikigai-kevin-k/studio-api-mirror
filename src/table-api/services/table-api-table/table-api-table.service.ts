import { ModuleLifecycle } from '@ikigaians/mod';
import { getLiveTableSessionHeaders } from '@ikigaians/web';
import { CacheService } from 'src/cache/cache.service';
import { AppConfigService } from 'src/config';
import { LoggerService } from 'src/log';
import { TableApiConnectFailureError } from 'src/table-api/errors/table-api.error';
import { TableApiSchema } from 'src/table-api/schema/table-api.schema';
import { send } from 'src/utils/send-utils';
import { fetch } from 'undici';

export class TableApiTableService implements ModuleLifecycle {
  constructor(
    private readonly cacheService: CacheService,
    private readonly appConfigService: AppConfigService,
    private readonly logger: LoggerService,
  ) {}

  private async sendTable(gameCode: string): Promise<TableApiSchema> {
    const resp = await fetch(
      `${this.appConfigService.tableApiConfig.url}/v2/service/tables/${gameCode}`,
      {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          ...(getLiveTableSessionHeaders() as { Cookie: string }),
        },
      },
    );

    const result = (await resp.json()) as TableApiSchema;
    if (!resp.ok || result.error) {
      throw new TableApiConnectFailureError(
        `[GET] ${resp.url} failure ! status: ${resp.status}, code: ${result.error.code}, message: ${result.error.message}`,
      );
    }
    this.logger.info(`[GET] ${resp.url} result = ${JSON.stringify(result)}`);
    return result;
  }

  private async queryTableName(gameCode: string): Promise<string> {
    const resp = await send<TableApiSchema>(
      () => this.sendTable(gameCode),
      this.appConfigService.tableApiConfig.maxRetry,
      this.logger,
    );
    return resp.data.table.name;
  }

  private getCacheKey() {
    return `studio-table-name`;
  }

  private async getCache(gameCode: string): Promise<string> {
    const tag = this.getCacheKey();
    const cache = await this.cacheService.hmGet(tag, [gameCode]);
    const result = cache[0];
    if (!result) {
      const name = await this.queryTableName(gameCode);
      await this.cacheService.hSet(tag, new Map([[gameCode, name]]));
      return name;
    }
    return result;
  }

  async getTableName(gameCode: string): Promise<string> {
    return await this.getCache(gameCode);
  }

  async onInit() {}
}
