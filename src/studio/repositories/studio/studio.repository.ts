import { ModuleLifecycle } from '@ikigaians/mod';
import { DbService } from 'src/db/db.service';
import { Studio } from '../../entities/studio.entity';
import {
  InsertStudioTableResult,
  StudioTableResult,
  UpdateStudioTableStatusEntity,
} from './studio.repository.type';

export class StudioRepository implements ModuleLifecycle {
  constructor(private readonly dbService: DbService) {}

  async getStudioTableByTableID(tableID: string): Promise<Studio | null> {
    const builder = this.dbService
      .getConnection()
      .getRepository(Studio)
      .createQueryBuilder('studio')
      .where('studio.TABLE_ID = :tableID', { tableID: tableID });

    return await builder.getOne();
  }

  async getStudio(): Promise<StudioTableResult[]> {
    const builder = this.dbService
      .getConnection()
      .createQueryBuilder(Studio, 'studio')
      .select(['studio."TABLE_ID" as "tableId"', 'studio."TABLE_STATUS" as "tableStatus"']);

    return await builder.getRawMany<StudioTableResult>();
  }

  async insertStudioTable(studio: Studio): Promise<InsertStudioTableResult> {
    const result = await this.dbService
      .getConnection()
      .createQueryBuilder()
      .insert()
      .into(Studio)
      .values(studio)
      .returning(['tableId', 'tableStatus'])
      .execute();
    return result.raw[0] as InsertStudioTableResult;
  }

  async updateStudioTableStatus(entity: UpdateStudioTableStatusEntity): Promise<number> {
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
      .execute();

    return updateResult.affected ?? -1;
  }

  async onInit(): Promise<void> {}
}
