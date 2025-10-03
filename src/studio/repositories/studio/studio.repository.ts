import { ModuleLifecycle } from '@ikigaians/mod';
import { CacheService } from 'src/cache/cache.service';
import { DbService } from 'src/db/db.service';
import { StudioNotFoundError, StudioUpdateError } from 'src/studio/errors/studio.error';
import { schema } from 'src/studio/services/studio/studio.service.type';
import { Studio } from '../../entities/studio.entity';
import { StudioTableStatusEnum } from '../../enums/studio.enums';
import { DbStudioResult, UpdateStudioTableStatusEntity } from './studio.repository.type';

type StudioTableSchema = {
  TABLE_ID: string;
  TABLE_STATUS: StudioTableStatusEnum;
  GAME_ID: string;
};

export class StudioRepository implements ModuleLifecycle {
  constructor(
    private readonly cacheService: CacheService,
    private readonly dbService: DbService,
  ) {}

  async getStudioTableByTableID(tableID: string): Promise<DbStudioResult> {
    const cache = await this.getCache(tableID);
    if (cache) return cache;

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

    const output = await builder.getRawOne<DbStudioResult>();
    if (!output) {
      throw new StudioNotFoundError(`[studio] ${tableID} not found`);
    }

    await this.refreshCache(tableID, output);

    return output;
  }

  async insertStudioTable(tableId: string): Promise<DbStudioResult> {
    const studio: Studio = new Studio();
    studio.tableId = tableId;
    studio.tableStatus = StudioTableStatusEnum.INITIAL;

    await this.dbService
      .getConnection()
      .createQueryBuilder()
      .insert()
      .into(Studio)
      .values(studio)
      .execute();

    const output = {
      tableId: tableId,
      tableStatus: StudioTableStatusEnum.INITIAL,
    };

    await this.refreshCache(tableId, output);
    return output;
  }

  async updateStudioTable(entity: UpdateStudioTableStatusEntity): Promise<DbStudioResult> {
    const { tableId } = entity;
    const updateResult = await this.dbService
      .getConnection()
      .createQueryBuilder()
      .update(Studio)
      .set(entity)
      .where('tableId = :tableId', { tableId })
      .returning('*')
      .execute();

    if (updateResult.affected === 0) {
      throw new StudioUpdateError(`[studio] ${tableId} hasn't been modified`);
    }

    const data = updateResult.raw[0] as StudioTableSchema;
    const output = {
      tableId: data.TABLE_ID,
      tableStatus: data.TABLE_STATUS,
      gameId: data.GAME_ID,
    };

    await this.refreshCache(tableId, output);

    return output;
  }

  private getCacheKey(tableCode: string) {
    return `studio-${tableCode}`;
  }

  private async getCache(key: string): Promise<DbStudioResult | undefined> {
    const tag = this.getCacheKey(key);
    return await this.cacheService.getHashAs<DbStudioResult>(tag, schema);
  }

  private async refreshCache(tableCode: string, data: DbStudioResult) {
    const cacheKey = this.getCacheKey(tableCode);
    await this.cacheService.setHash(cacheKey, data);
  }

  async onInit(): Promise<void> {}
}
