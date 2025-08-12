/* eslint-disable unicorn/no-null */
import { ModuleLifecycle } from '@ikigaians/mod';
import { DbService } from 'src/db/db.service';
import { StudioCdn } from 'src/studio/entities/studio-cdn.entity';
import { StudioCacheData } from 'src/studio/services/studio-cache/studio-cache.service.type';
import { Studio } from '../../entities/studio.entity';

export class StudioCacheRepository implements ModuleLifecycle {
  constructor(private readonly dbService: DbService) {}

  async getStudioCache(): Promise<StudioCacheData[]> {
    const builder = this.dbService
      .getConnection()
      .createQueryBuilder(Studio, 'studio')
      .select(['studio."TABLE_ID" as "tableId"', 'studio."TABLE_STATUS" as "tableStatus"']);

    return await builder.getRawMany<StudioCacheData>();
  }

  async getStudioCdnCache(): Promise<StudioCacheData[]> {
    const builder = this.dbService
      .getConnection()
      .createQueryBuilder(StudioCdn, 'studio')
      .select(['studio."TABLE_ID" as "tableId"', 'studio."CDN" as "cdnDst"']);

    return await builder.getRawMany<StudioCacheData>();
  }

  async onInit(): Promise<void> {}
}
