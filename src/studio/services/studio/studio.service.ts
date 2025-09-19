import { LoggerService } from '@ikigaians/logger';
import { ModuleLifecycle } from '@ikigaians/mod';
import { CacheService } from 'src/cache/cache.service';
import {
  GetStudioTableRequestType,
  InsertStudioTableRequestType,
  UpdateStudioTableStatusRequestType,
} from 'src/studio/controller/v1/studio/studio.type';
import { StudioNotFoundError } from 'src/studio/errors/studio-not-found.error';
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
    studio.tableStatus = type.tableStatus;

    const output = await this.studioRepository.insertStudioTable(studio);
    await this.refreshCache(output.tableId, output);

    return output;
  }

  async updateStudioTableStatus(
    type: UpdateStudioTableStatusRequestType,
  ): Promise<UpdateStudioServiceStatusOutput> {
    const entity: UpdateStudioTableStatusEntity = {
      tableId: type.tableId,
      tableStatus: type.tableStatus,
    };

    const result = await this.studioRepository.updateStudioTableStatus(entity);
    if (result === undefined)
      throw new StudioNotFoundError(`tableId ${type.tableId} can't be found`);

    await this.refreshCache(result.tableId, result);

    const output = {
      tableId: type.tableId,
      tableStatus: type.tableStatus,
    };

    return output;
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
