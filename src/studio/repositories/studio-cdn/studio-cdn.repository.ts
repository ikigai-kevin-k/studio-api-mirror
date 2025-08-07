/* eslint-disable unicorn/no-null */
import { ModuleLifecycle } from '@ikigaians/mod';
import { DbService } from 'src/db/db.service';
import {
  GetTableCdnQuery,
  TableCdnResult,
} from 'src/studio/services/studio-cdn/studio-cdn.service.type';
import { StudioCdn } from '../../entities/studio-cdn.entity';
import { UpsertTableCdnResult } from './studio-cdn.repository.type';

export class StudioCdnRepository implements ModuleLifecycle {
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
      .select(['studio."CDN" as "cdn"'])
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
      .orUpdate(['CDN'], ['TABLE_ID'])
      .returning(['tableId', 'cdnDst'])
      .execute();
    return result.raw[0] as UpsertTableCdnResult;
  }

  async onInit(): Promise<void> {}
}
