import { ModuleLifecycle } from '@ikigaians/mod';
import { CacheService } from 'src/cache/cache.service';
import { Schema } from 'src/cache/cache.service.type';
import { DbService } from 'src/db/db.service';
import { StudioGame } from 'src/studio/entities/studio-game.entity';
import { StudioNotFoundError, StudioUpdateError } from 'src/studio/errors/studio.error';
import { DbStudioGameResult, StudioGameEntity } from './studio-game.repository.type';

type StudioGameSchema = {
  PHYSICAL_TABLE_CODE: string;
  PRIMARY_PHYSICAL_TABLE_ID: string;
  SECONDARY_PHYSICAL_TABLE_ID: string;
  CURRENT_PHYSICAL_TABLE_ID: string;
};

const schema: Schema<DbStudioGameResult> = {
  physicalTableCode: 'string',
  primaryTableId: 'string',
  secondaryTableId: 'string',
  currentTableId: 'string',
};

export class StudioGameRepository implements ModuleLifecycle {
  constructor(
    private readonly cacheService: CacheService,
    private readonly dbService: DbService,
  ) {}

  async getGameByPhysicalTableCode(physicalTableCode: string): Promise<DbStudioGameResult> {
    const cache = await this.getCache(physicalTableCode);
    if (cache) return cache;

    const builder = this.dbService
      .getConnection()
      .getRepository(StudioGame)
      .createQueryBuilder('studio')
      .where('studio.PHYSICAL_TABLE_CODE = :physicalTableCode', { physicalTableCode })
      .select([
        'studio."PHYSICAL_TABLE_CODE" as "physicalTableCode"',
        'studio."PRIMARY_PHYSICAL_TABLE_ID" as "primaryTableId"',
        'studio."SECONDARY_PHYSICAL_TABLE_ID" as "secondaryTableId"',
        'studio."CURRENT_PHYSICAL_TABLE_ID" as "currentTableId"',
      ]);

    const output = await builder.getRawOne<DbStudioGameResult>();
    if (!output) {
      throw new StudioNotFoundError(`[studio_game] ${physicalTableCode} not found`);
    }

    await this.refreshCache(physicalTableCode, output);

    return output;
  }

  async insertGame(entity: StudioGameEntity): Promise<DbStudioGameResult> {
    const result = await this.dbService
      .getConnection()
      .createQueryBuilder()
      .insert()
      .into(StudioGame)
      .values(entity)
      .returning(['physicalTableCode', 'primaryTableId', 'secondaryTableId', 'currentTableId'])
      .execute();

    const data = result.raw[0] as StudioGameSchema;
    const output = {
      physicalTableCode: data.PHYSICAL_TABLE_CODE,
      primaryTableId: data.PRIMARY_PHYSICAL_TABLE_ID,
      secondaryTableId: data.SECONDARY_PHYSICAL_TABLE_ID,
      currentTableId: data.CURRENT_PHYSICAL_TABLE_ID,
    };

    await this.refreshCache(output.physicalTableCode, output);
    return output;
  }

  async updateGame(entity: StudioGameEntity): Promise<DbStudioGameResult> {
    const { physicalTableCode, primaryTableId, secondaryTableId, currentTableId } = entity;
    const updateFields: { [key: string]: string | undefined } = {};

    if (primaryTableId !== undefined) {
      updateFields.primaryTableId = primaryTableId;
    }

    if (secondaryTableId !== undefined) {
      updateFields.secondaryTableId = secondaryTableId;
    }

    if (currentTableId !== undefined) {
      updateFields.currentTableId = currentTableId;
    }

    if (Object.keys(updateFields).length === 0) {
      throw new StudioUpdateError(`[studio_game] ${physicalTableCode} hasn't been modified`);
    }

    const updateResult = await this.dbService
      .getConnection()
      .createQueryBuilder()
      .update(StudioGame)
      .set(updateFields)
      .where('physicalTableCode = :physicalTableCode', { physicalTableCode })
      .returning(['physicalTableCode', 'primaryTableId', 'secondaryTableId', 'currentTableId'])
      .execute();

    if (updateResult.affected === 0) {
      throw new StudioUpdateError(`[studio_game] ${physicalTableCode} hasn't been modified`);
    }

    const data = updateResult.raw[0] as StudioGameSchema;
    const output = {
      physicalTableCode: data.PHYSICAL_TABLE_CODE,
      primaryTableId: data.PRIMARY_PHYSICAL_TABLE_ID,
      secondaryTableId: data.SECONDARY_PHYSICAL_TABLE_ID,
      currentTableId: data.CURRENT_PHYSICAL_TABLE_ID,
    };

    await this.refreshCache(physicalTableCode, output);

    return output;
  }

  private getCacheKey(physicalTableCode: string) {
    return `studio-game-${physicalTableCode}`;
  }

  private async getCache(key: string): Promise<DbStudioGameResult | undefined> {
    const tag = this.getCacheKey(key);
    return await this.cacheService.getHashAs<DbStudioGameResult>(tag, schema);
  }

  private async refreshCache(physicalTableCode: string, data: DbStudioGameResult) {
    const cacheKey = this.getCacheKey(physicalTableCode);
    await this.cacheService.setHash(cacheKey, data);
  }

  async onInit(): Promise<void> {}
}
