import { ModuleLifecycle } from '@ikigaians/mod';
import { DbService } from 'src/db/db.service';
import { StudioCdn } from '../../entities/studio-cdn.entity';
import { TableCdnResult, TableCdnSchema, UpdateTableCdnEntity } from './studio-cdn.repository.type';

export class StudioCdnRepository implements ModuleLifecycle {
  constructor(private readonly dbService: DbService) {}

  async getTableCdnByTableID(tableID: string): Promise<TableCdnResult | undefined> {
    const builder = this.dbService
      .getConnection()
      .getRepository(StudioCdn)
      .createQueryBuilder('studio')
      .where('studio.TABLE_ID = :tableID', { tableID: tableID })
      .select(['studio."TABLE_ID" as "tableId"', 'studio."CDN" as "cdnDst"']);

    return await builder.getRawOne<TableCdnResult>();
  }

  async insertTableCdn(studioCdn: StudioCdn): Promise<TableCdnResult> {
    const result = await this.dbService
      .getConnection()
      .createQueryBuilder()
      .insert()
      .into(StudioCdn)
      .values(studioCdn)
      .returning('*')
      .execute();

    const data = result.raw[0] as TableCdnSchema;
    return {
      tableId: data.TABLE_ID,
      cdnDst: data.CDN,
    };
  }

  async updateTableCdn(entity: UpdateTableCdnEntity): Promise<TableCdnResult | undefined> {
    const updateResult = await this.dbService
      .getConnection()
      .createQueryBuilder()
      .update(StudioCdn)
      .set({ cdnDst: entity.cdnDst })
      .where('tableId = :tableId', { tableId: entity.tableId })
      .returning('*')
      .execute();

    if (updateResult.affected === 0) return undefined;

    const data = updateResult.raw[0] as TableCdnSchema;
    return {
      tableId: data.TABLE_ID,
      cdnDst: data.CDN,
    };
  }

  async onInit(): Promise<void> {}
}
