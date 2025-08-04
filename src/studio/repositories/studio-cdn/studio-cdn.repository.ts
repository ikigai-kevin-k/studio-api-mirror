/* eslint-disable unicorn/no-null */
import { DbService } from 'src/db/db.service';
import { GetTableCdnQuery, TableCdnResult } from 'src/studio/model/studio-cdn/studio-cdn.model';
import { StudioCdn } from '../../entities/studio-cdn.entity';
import { UpsertTableCdnResult } from './studio-cdn.repository.type';

export class StudioCdnRepository {
  constructor(private readonly dbService: DbService) {}

  async getTableCdnByTableID(tableID: string): Promise<StudioCdn | null> {
    const builder = this.dbService
      .getConnection()
      .getRepository(StudioCdn)
      .createQueryBuilder('studio')
      .where('studio.TABLE_ID = :tableID', { tableID: tableID });

    return await builder.getOne();
  }

  async getTableCdn(query: GetTableCdnQuery) {
    const repository = this.dbService.getConnection();
    const builder = repository
      .createQueryBuilder()
      .select([
        'studio."PRIMARY_HD" as "primaryHd"',
        'studio."PRIMARY_HI" as "primaryHi"',
        'studio."PRIMARY_ME" as "primaryMe"',
        'studio."PRIMARY_LO" as "primaryLo"',
        'studio."SECONDARY_HD" as "secondaryHd"',
        'studio."SECONDARY_HI" as "secondaryHi"',
        'studio."SECONDARY_ME" as "secondaryMe"',
        'studio."SECONDARY_LO" as "secondaryLo"',
      ])
      .from(StudioCdn, 'studio')
      .where('studio.TABLE_ID = :tableId', { tableId: query.tableId });

    return await builder.getRawOne<TableCdnResult>();
  }

  async upsertTableCdn(studioCdn: StudioCdn): Promise<UpsertTableCdnResult> {
    const result = await this.dbService
      .getConnection()
      .createQueryBuilder()
      .insert()
      .into(StudioCdn)
      .values(studioCdn)
      .orUpdate(
        [
          'PRIMARY_HD',
          'PRIMARY_HI',
          'PRIMARY_ME',
          'PRIMARY_LO',
          'SECONDARY_HD',
          'SECONDARY_HI',
          'SECONDARY_ME',
          'SECONDARY_LO',
        ],
        ['TABLE_ID'],
      )
      .returning([
        'tableId',
        'primaryHd',
        'primaryHi',
        'primaryMe',
        'primaryLo',
        'secondaryHd',
        'secondaryHi',
        'secondaryMe',
        'secondaryLo',
      ])
      .execute();
    return result.raw[0] as UpsertTableCdnResult;
  }
}
