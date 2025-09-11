import { ModuleLifecycle } from '@ikigaians/mod';
import { DbService } from 'src/db/db.service';
import { StudioCdn } from '../../entities/studio-cdn.entity';
import {
  GetTableCdnResult,
  InsertTableCdnResult,
  UpdateTableCdnEntity,
} from './studio-cdn.repository.type';

export class StudioCdnRepository implements ModuleLifecycle {
  constructor(private readonly dbService: DbService) {}

  async getTableCdnByTableID(tableID: string): Promise<GetTableCdnResult | undefined> {
    const builder = this.dbService
      .getConnection()
      .getRepository(StudioCdn)
      .createQueryBuilder('studio')
      .where('studio.TABLE_ID = :tableID', { tableID: tableID })
      .select(['studio."TABLE_ID" as "tableId"', 'studio."CDN" as "cdnDst"']);

    return await builder.getRawOne<GetTableCdnResult>();
  }

  async insertTableCdn(studioCdn: StudioCdn): Promise<InsertTableCdnResult> {
    const result = await this.dbService
      .getConnection()
      .createQueryBuilder()
      .insert()
      .into(StudioCdn)
      .values(studioCdn)
      .returning(['tableId', 'cdnDst'])
      .execute();
    return result.raw[0] as InsertTableCdnResult;
  }

  async updateTableCdn(entity: UpdateTableCdnEntity): Promise<number> {
    const updateResult = await this.dbService
      .getConnection()
      .createQueryBuilder()
      .update(StudioCdn)
      .set({ cdnDst: entity.cdnDst })
      .where('tableId = :tableId', { tableId: entity.tableId })
      .returning(['tableId', 'cdnDst'])
      .execute();

    return updateResult.affected ?? -1;
  }

  async onInit(): Promise<void> {}
}
