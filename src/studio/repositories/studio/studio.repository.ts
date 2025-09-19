import { ModuleLifecycle } from '@ikigaians/mod';
import { DbService } from 'src/db/db.service';
import { Studio } from '../../entities/studio.entity';
import {
  StudioTableResult,
  StudioTableSchema,
  UpdateStudioTableStatusEntity,
} from './studio.repository.type';

export class StudioRepository implements ModuleLifecycle {
  constructor(private readonly dbService: DbService) {}

  async getStudioTableByTableID(tableID: string): Promise<StudioTableResult | undefined> {
    const builder = this.dbService
      .getConnection()
      .getRepository(Studio)
      .createQueryBuilder('studio')
      .where('studio.TABLE_ID = :tableID', { tableID: tableID })
      .select(['studio."TABLE_ID" as "tableId"', 'studio."TABLE_STATUS" as "tableStatus"']);

    return await builder.getRawOne<StudioTableResult>();
  }

  async insertStudioTable(studio: Studio): Promise<StudioTableResult> {
    const result = await this.dbService
      .getConnection()
      .createQueryBuilder()
      .insert()
      .into(Studio)
      .values(studio)
      .returning('*')
      .execute();

    const data = result.raw[0] as StudioTableSchema;
    return {
      tableId: data.TABLE_ID,
      tableStatus: data.TABLE_STATUS,
    };
  }

  async updateStudioTableStatus(
    entity: UpdateStudioTableStatusEntity,
  ): Promise<StudioTableResult | undefined> {
    const updateResult = await this.dbService
      .getConnection()
      .createQueryBuilder()
      .update(Studio)
      .set({
        tableStatus: entity.tableStatus,
      })
      .where({
        tableId: entity.tableId,
      })
      .returning('*')
      .execute();

    if (updateResult.affected === 0) return undefined;

    const data = updateResult.raw[0] as StudioTableSchema;
    return {
      tableId: data.TABLE_ID,
      tableStatus: data.TABLE_STATUS,
    };
  }

  async onInit(): Promise<void> {}
}
