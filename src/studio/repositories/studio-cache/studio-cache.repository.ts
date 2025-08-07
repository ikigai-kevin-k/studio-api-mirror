/* eslint-disable unicorn/no-null */
import { DbService } from 'src/db/db.service';
import { StudioCacheResult } from 'src/studio/services/studio-cache/studio-cache.service.type';
import { Studio } from '../../entities/studio.entity';

export class StudioCacheRepository {
  constructor(private readonly dbService: DbService) {}

  async getCacheByTableID(tableID: string): Promise<StudioCacheResult | undefined> {
    const builder = this.dbService
      .getConnection()
      .getRepository(Studio)
      .createQueryBuilder('studio')
      .leftJoinAndSelect('studio-cdn', 'sc', 'sc.TABLE_ID = studio.TABLE_ID')
      .select([
        'studio."TABLE_ID" as "tableId"',
        'studio."TABLE_STATUS" as "tableStatus"',
        `COALESCE(sc."CDN", '{"primary": { "hd":"", "hi":"", "me":"", "lo":"" }, "secondary": { "hd":"", "hi":"", "me":"", "lo":"" }}') as "cdnDst"`,
      ])
      .where('studio.TABLE_ID = :tableID', { tableID: tableID });

    return await builder.getRawOne<StudioCacheResult>();
  }

  async getCaches(): Promise<StudioCacheResult[]> {
    const builder = this.dbService
      .getConnection()
      .createQueryBuilder(Studio, 'studio')
      .leftJoinAndSelect('studio-cdn', 'sc', 'sc.TABLE_ID = studio.TABLE_ID')
      .select([
        'studio."TABLE_ID" as "tableId"',
        'studio."TABLE_STATUS" as "tableStatus"',
        `COALESCE(sc."CDN", '{"primary": { "hd":"", "hi":"", "me":"", "lo":"" }, "secondary": { "hd":"", "hi":"", "me":"", "lo":"" }}') as "cdnDst"`,
      ]);

    return await builder.getRawMany<StudioCacheResult>();
  }
}
