/* eslint-disable unicorn/no-null */
import { DbService } from 'src/db/db.service';
import { GetStudioTableQuery, StudioTableResult } from 'src/studio/model/studio/studio.model';
import { Studio } from '../../entities/studio.entity';
import { UpdateStudioTableEntity, UpsertStudioTableResult } from './studio.repository.type';

export class StudioRepository {
  constructor(private readonly dbService: DbService) {}

  async getStudioTableByTableID(tableID: string): Promise<Studio | null> {
    const builder = this.dbService
      .getConnection()
      .getRepository(Studio)
      .createQueryBuilder('studio')
      .where('studio.TABLE_ID = :tableID', { tableID: tableID });

    return await builder.getOne();
  }

  async getStudioTable(query: GetStudioTableQuery): Promise<StudioTableResult[]> {
    const builder = this.dbService
      .getConnection()
      .createQueryBuilder()
      .select(['studio."TABLE_ID" as "tableId"', 'studio."TABLE_STATUS" as "tableStatus"'])
      .from(Studio, 'studio')
      .where('studio.TABLE_ID IN (:...tableId)', {
        tableId: query.tableId,
      });

    return await builder.getRawMany<StudioTableResult>();
  }

  async upsertStudio(studio: Studio): Promise<UpsertStudioTableResult> {
    const result = await this.dbService
      .getConnection()
      .createQueryBuilder()
      .insert()
      .into(Studio)
      .values(studio)
      .orUpdate(['TABLE_STATUS'], ['TABLE_ID'])
      .returning(['tableId', 'tableStatus'])
      .execute();
    return result.raw[0] as UpsertStudioTableResult;
  }

  async updateStudioTableStatus(UpdateStudioTableEntity: UpdateStudioTableEntity): Promise<number> {
    const updateResult = await this.dbService
      .getConnection()
      .createQueryBuilder()
      .update(Studio)
      .set({
        tableStatus: UpdateStudioTableEntity.tableStatus,
      })
      .where({
        tableId: UpdateStudioTableEntity.tableId,
      })
      .execute();

    return updateResult.affected ?? -1;
  }
}
