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

    await this.refreshCache(output);

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

    await this.refreshCache(output);

    return output;
  }

  async getCache(key: string): Promise<StudioServiceOutput | undefined> {
    const tag = `studio-${key}`;
    const raw = await this.cacheService.get(tag);

    if (!raw) {
      const output = await this.studioRepository.getStudioTableByTableID(key);
      if (output) await this.cacheService.set(tag, JSON.stringify(output), 86_400);
      return output;
    }

    return JSON.parse(raw) as StudioServiceOutput;
  }

  async refreshCache(cache: StudioServiceOutput): Promise<void> {
    const origin = await this.getCache(cache.tableId);

    const result = {
      ...origin,
      ...Object.fromEntries(
        Object.entries(cache).filter(([_key, v]) => _key !== undefined && v !== undefined),
      ),
    } as StudioServiceOutput;

    return await this.cacheService.set(`studio-${cache.tableId}`, JSON.stringify(result), 86_400);
  }

  async onInit(): Promise<void> {}
}
