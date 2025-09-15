import { LoggerService } from '@ikigaians/logger';
import { ModuleLifecycle } from '@ikigaians/mod';
import { CacheService } from 'src/cache/cache.service';
import {
  GetStudioTableRequestType,
  InsertStudioTableRequestType,
  UpdateStudioTableStatusRequestType,
} from 'src/studio/controller/v1/studio/studio.type';
import { StudioNotFoundError } from 'src/studio/errors/studio-not-found.error';
import { UpdateStudioTableStatusEntity } from 'src/studio/repositories/studio/studio.repository.type';
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

    const studioReturning = await this.studioRepository.insertStudioTable(studio);

    const output = {
      tableId: studioReturning.TABLE_ID,
      tableStatus: studioReturning.TABLE_STATUS,
    };

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
    if (result <= 0) throw new StudioNotFoundError(`tableId ${type.tableId} can't be found`);

    const output = {
      tableId: type.tableId,
      tableStatus: type.tableStatus,
    };

    await this.cacheService.refresh(this.getCacheKey(output.tableId), output);

    return output;
  }

  private getCacheKey(gameCode: string) {
    return `studio-${gameCode}`;
  }

  async getCache(key: string): Promise<StudioServiceOutput | undefined> {
    const tag = this.getCacheKey(key);

    const cache = await this.cacheService.getHashAs<StudioServiceOutput>(tag, schema);
    if (!cache) {
      const output = await this.studioRepository.getStudioTableByTableID(key);
      if (output) await this.cacheService.setHash(tag, output);
      return output;
    }

    return cache;
  }

  async onInit(): Promise<void> {}
}
