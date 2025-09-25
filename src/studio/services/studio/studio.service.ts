import { LoggerService } from '@ikigaians/logger';
import { ModuleLifecycle } from '@ikigaians/mod';
import { CacheService } from 'src/cache/cache.service';
import { UNKNOWN_GAME_CODE } from 'src/studio/const/studio.const';
import {
  GetStudioTableRequestType,
  InsertStudioTableRequestType,
  UpdateStudioTableStatusRequestType,
} from 'src/studio/controller/v1/studio/studio.type';
import { StudioTableStatusEnum } from 'src/studio/enums/studio.enums';
import { StudioNotFoundError } from 'src/studio/errors/studio.error';
import {
  StudioTableResult,
  UpdateStudioTableStatusEntity,
} from 'src/studio/repositories/studio/studio.repository.type';
import {
  GetStudioServiceOutput,
  InsertStudioServiceOutput,
  schema,
  StudioServiceOutput,
  UpdateStudioServiceStatusOutput,
} from 'src/studio/services/studio/studio.service.type';
import { Studio } from '../../entities/studio.entity';
import { StudioRepository } from '../../repositories/studio/studio.repository';

export class StudioService implements ModuleLifecycle {
  constructor(
    private readonly studioRepository: StudioRepository,
    private readonly cacheService: CacheService,
    private readonly logger: LoggerService,
  ) {}

  async getStudioTable(type: GetStudioTableRequestType): Promise<GetStudioServiceOutput> {
    const studioReturning: StudioServiceOutput[] = [];

    for (const tableId of type.tableId ?? []) {
      const data = await this.getCache(tableId);
      if (data) studioReturning.push(data);
    }

    return {
      list: studioReturning,
    };
  }

  async insertStudioTable(type: InsertStudioTableRequestType): Promise<InsertStudioServiceOutput> {
    const studio: Studio = new Studio();
    studio.tableId = type.tableId;
    studio.tableStatus = type.tableStatus || StudioTableStatusEnum.FAILURE;
    studio.gameId = type.gameId || UNKNOWN_GAME_CODE;

    const output = await this.studioRepository.insertStudioTable(studio);
    await this.refreshCache(output.tableId, output);

    return output;
  }

  async updateStudioTable(
    type: UpdateStudioTableStatusRequestType,
  ): Promise<UpdateStudioServiceStatusOutput> {
    const entity: UpdateStudioTableStatusEntity = {
      tableStatus: type.tableStatus,
      gameId: type.gameId,
    };

    const result = await this.studioRepository.updateStudioTable(type.tableId, entity);
    if (result === undefined)
      throw new StudioNotFoundError(`tableId ${type.tableId} can't be found`);

    await this.refreshCache(result.tableId, result);

    const output = {
      tableId: type.tableId,
      tableStatus: type.tableStatus,
      gameId: type.gameId,
    };

    return output;
  }

  async setStudioTableStatus(tableId: string, status: StudioTableStatusEnum) {
    const result = await this.studioRepository.updateStudioTable(tableId, { tableStatus: status });
    if (result === undefined) return false;

    await this.refreshCache(result.tableId, result);
    return true;
  }

  async getStudioTableBelongTo(tableId: string) {
    const cache = await this.getCache(tableId);
    return cache?.gameId;
  }

  private getCacheKey(gameCode: string) {
    return `studio-${gameCode}`;
  }

  async getCache(key: string): Promise<StudioServiceOutput | undefined> {
    const tag = this.getCacheKey(key);
    const cache = await this.cacheService.getHashAs<StudioServiceOutput>(tag, schema);
    if (cache === undefined) {
      const output = await this.studioRepository.getStudioTableByTableID(key);
      if (output) await this.cacheService.setHash(tag, output);
      return output;
    }
    return cache;
  }

  private async refreshCache(gameCode: string, data: StudioTableResult) {
    const cacheKey = this.getCacheKey(gameCode);
    await this.cacheService.setHash(cacheKey, data);
  }

  async onInit(): Promise<void> {}
}
