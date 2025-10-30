import { ModuleLifecycle } from '@ikigaians/mod';
import { CacheService } from 'src/cache/cache.service';
import { Schema } from 'src/cache/cache.service.type';
import { DbService } from 'src/db/db.service';
import { StudioGame } from 'src/studio/entities/studio-game.entity';
import { StudioNotFoundError, StudioUpdateError } from 'src/studio/errors/studio.error';
import { DbStudioGameResult, StudioGameEntity } from './studio-game.repository.type';

type StudioGameSchema = {
  GAME_ID: string;
  PRIMARY_TABLE_ID: string;
  SECONDARY_TABLE_ID: string;
  CURRENT_TABLE_ID: string;
};

const schema: Schema<DbStudioGameResult> = {
  gameId: 'string',
  primaryTableId: 'string',
  secondaryTableId: 'string',
  currentTableId: 'string',
};

export class StudioGameRepository implements ModuleLifecycle {
  constructor(
    private readonly cacheService: CacheService,
    private readonly dbService: DbService,
  ) {}

  async getGameByID(gameID: string): Promise<DbStudioGameResult> {
    const cache = await this.getCache(gameID);
    if (cache) return cache;

    const builder = this.dbService
      .getConnection()
      .getRepository(StudioGame)
      .createQueryBuilder('studio')
      .where('studio.GAME_ID = :gameID', { gameID: gameID })
      .select([
        'studio."GAME_ID" as "gameId"',
        'studio."PRIMARY_TABLE_ID" as "primaryTableId"',
        'studio."SECONDARY_TABLE_ID" as "secondaryTableId"',
        'studio."CURRENT_TABLE_ID" as "currentTableId"',
      ]);

    const output = await builder.getRawOne<DbStudioGameResult>();
    if (!output) {
      throw new StudioNotFoundError(`[studio_game] ${gameID} not found`);
    }

    await this.refreshCache(gameID, output);

    return output;
  }

  async insertGame(entity: StudioGameEntity): Promise<DbStudioGameResult> {
    const result = await this.dbService
      .getConnection()
      .createQueryBuilder()
      .insert()
      .into(StudioGame)
      .values(entity)
      .returning(['gameId', 'primaryTableId', 'secondaryTableId', 'currentTableId'])
      .execute();

    const data = result.raw[0] as StudioGameSchema;
    const output = {
      gameId: data.GAME_ID,
      primaryTableId: data.PRIMARY_TABLE_ID,
      secondaryTableId: data.SECONDARY_TABLE_ID,
      currentTableId: data.CURRENT_TABLE_ID,
    };

    await this.refreshCache(output.gameId, output);
    return output;
  }

  async updateGame(entity: StudioGameEntity): Promise<DbStudioGameResult> {
    const { gameId } = entity;
    const updateResult = await this.dbService
      .getConnection()
      .createQueryBuilder()
      .update(StudioGame)
      .set(entity)
      .where('gameId = :gameId', { gameId })
      .returning(['gameId', 'primaryTableId', 'secondaryTableId', 'currentTableId'])
      .execute();

    if (updateResult.affected === 0) {
      throw new StudioUpdateError(`[studio_game] ${gameId} hasn't been modified`);
    }

    const data = updateResult.raw[0] as StudioGameSchema;
    const output = {
      gameId: data.GAME_ID,
      primaryTableId: data.PRIMARY_TABLE_ID,
      secondaryTableId: data.SECONDARY_TABLE_ID,
      currentTableId: data.CURRENT_TABLE_ID,
    };

    await this.refreshCache(gameId, output);

    return output;
  }

  private getCacheKey(gameCode: string) {
    return `studio-game-${gameCode}`;
  }

  private async getCache(key: string): Promise<DbStudioGameResult | undefined> {
    const tag = this.getCacheKey(key);
    return await this.cacheService.getHashAs<DbStudioGameResult>(tag, schema);
  }

  private async refreshCache(gameCode: string, data: DbStudioGameResult) {
    const cacheKey = this.getCacheKey(gameCode);
    await this.cacheService.setHash(cacheKey, data);
  }

  async onInit(): Promise<void> {}
}
