/* eslint-disable unicorn/no-null */
import { DbService } from 'src/db/db.service';
import { StudioCacheResult } from 'src/studio/model/studio-cache/studio-cache.model';
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
        'sc."PRIMARY_HD" as "primaryHd"',
        'sc."PRIMARY_HI" as "primaryHi"',
        'sc."PRIMARY_ME" as "primaryMe"',
        'sc."PRIMARY_LO" as "primaryLo"',
        'sc."SECONDARY_HD" as "secondaryHd"',
        'sc."SECONDARY_HI" as "secondaryHi"',
        'sc."SECONDARY_ME" as "secondaryMe"',
        'sc."SECONDARY_LO" as "secondaryLo"',
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
        'sc."PRIMARY_HD" as "primaryHd"',
        'sc."PRIMARY_HI" as "primaryHi"',
        'sc."PRIMARY_ME" as "primaryMe"',
        'sc."PRIMARY_LO" as "primaryLo"',
        'sc."SECONDARY_HD" as "secondaryHd"',
        'sc."SECONDARY_HI" as "secondaryHi"',
        'sc."SECONDARY_ME" as "secondaryMe"',
        'sc."SECONDARY_LO" as "secondaryLo"',
      ]);

    return await builder.getRawMany<StudioCacheResult>();
  }
}
