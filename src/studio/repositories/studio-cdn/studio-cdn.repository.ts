import { ModuleLifecycle } from '@ikigaians/mod';
import { CacheService } from 'src/cache/cache.service';
import { Schema } from 'src/cache/cache.service.type';
import { DbService } from 'src/db/db.service';
import { StudioNotFoundError, StudioUpdateError } from 'src/studio/errors/studio.error';
import { StudioCdn } from '../../entities/studio-cdn.entity';
import { DbStudioCdnResult, StudioCdnEntity, TableCdnSet } from './studio-cdn.repository.type';

type StudioCdnSchema = {
  TABLE_ID: string;
  CDN: Record<string, TableCdnSet>;
};

const schema: Schema<DbStudioCdnResult> = {
  tableId: 'string',
  cdnDst: 'object',
};

export class StudioCdnRepository implements ModuleLifecycle {
  constructor(
    private readonly cacheService: CacheService,
    private readonly dbService: DbService,
  ) {}

  async getTableCdnByTableID(tableId: string): Promise<DbStudioCdnResult> {
    const cache = await this.getCache(tableId);
    if (cache) return cache;

    const builder = this.dbService
      .getConnection()
      .getRepository(StudioCdn)
      .createQueryBuilder('studio')
      .where('studio.TABLE_ID = :tableId', { tableId })
      .select(['studio."TABLE_ID" as "tableId"', 'studio."CDN" as "cdnDst"']);

    const output = await builder.getRawOne<DbStudioCdnResult>();
    if (!output) {
      throw new StudioNotFoundError(`[studio_cdn] ${tableId} not found`);
    }

    await this.refreshCache(tableId, output);

    return output;
  }

  async insertTableCdn(entity: StudioCdnEntity): Promise<DbStudioCdnResult> {
    const result = await this.dbService
      .getConnection()
      .createQueryBuilder()
      .insert()
      .into(StudioCdn)
      .values(entity)
      .returning(['tableId', 'cdnDst'])
      .execute();

    const data = result.raw[0] as StudioCdnSchema;
    const output = {
      tableId: data.TABLE_ID,
      cdnDst: data.CDN,
    };

    await this.refreshCache(output.tableId, output);
    return output;
  }

  async updateTableCdn(entity: StudioCdnEntity): Promise<DbStudioCdnResult> {
    const updateResult = await this.dbService
      .getConnection()
      .createQueryBuilder()
      .update(StudioCdn)
      .set(entity)
      .where('tableId = :tableId', { tableId: entity.tableId })
      .returning(['tableId', 'cdnDst'])
      .execute();

    if (updateResult.affected === 0) {
      throw new StudioUpdateError(`[studio_cdn] ${entity.tableId} hasn't been modified`);
    }

    const data = updateResult.raw[0] as StudioCdnSchema;
    const output = {
      tableId: data.TABLE_ID,
      cdnDst: data.CDN,
    };

    await this.refreshCache(output.tableId, output);
    return output;
  }

  async onInit(): Promise<void> {}

  private getCacheKey(tableId: string) {
    return `studio-cdn-${tableId}`;
  }

  async getCache(tableId: string): Promise<DbStudioCdnResult | undefined> {
    const tag = this.getCacheKey(tableId);
    return await this.cacheService.getHashAs<DbStudioCdnResult>(tag, schema);
  }

  private async refreshCache(tableId: string, data: DbStudioCdnResult) {
    const cacheKey = this.getCacheKey(tableId);
    await this.cacheService.setHash(cacheKey, data);
  }
}
