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
      .select([
        'studio."TABLE_ID" as "tableId"',
        'studio."TABLE_STATUS" as "tableStatus"',
        'studio."GAME_ID" as "gameId"',
      ]);

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
      gameId: data.GAME_ID,
    };
  }

  async updateStudioTable(
    tableId: string,
    entity: UpdateStudioTableStatusEntity,
  ): Promise<StudioTableResult | undefined> {
    const whereClause = Object.keys(entity)
      .map((key) => `${key} = :${key}`)
      .join(' AND ');

    const updateResult = await this.dbService
      .getConnection()
      .createQueryBuilder()
      .update(Studio)
      .set(entity)
      .where('tableId = :tableId', { tableId })
      .andWhere(`NOT (${whereClause})`)
      .setParameters(entity)
      .returning('*')
      .execute();

    if (updateResult.affected === 0) return undefined;

    const data = updateResult.raw[0] as StudioTableSchema;
    return {
      tableId: data.TABLE_ID,
      tableStatus: data.TABLE_STATUS,
      gameId: data.GAME_ID,
    };
  }

  async onInit(): Promise<void> {}
}
