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

  async getStudioTableByTableID(tableId: string): Promise<Studio> {
    const entity = await this.studioRepository.getStudioTableByTableID(tableId);

    if (!entity) {
      throw new StudioNotFoundError(`table ${tableId} not found`);
    }
    return entity;
  }

  async getStudioTable(type: GetStudioTableRequestType): Promise<GetStudioServiceOutput> {
    const cacheMap = await this.getCaches();

    const studioReturning: StudioServiceOutput[] = [];

    for (const tableId of type.tableId ?? []) {
      const data = cacheMap.get(tableId);
      if (data) {
        studioReturning.push(data as StudioServiceOutput);
      }
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

  async getCaches(): Promise<Map<string, StudioServiceOutput>> {
    const tag = 'studio';
    const hashTable = await this.cacheService.get(tag);

    if (!hashTable) {
      const caches = await this.studioRepository.getStudio();

      const cacheMap = new Map();
      for (const cache of caches) {
        cacheMap.set(cache.tableId, cache);
      }

      await this.cacheService.set(tag, JSON.stringify([...cacheMap]), 86_400);

      return cacheMap;
    }

    return new Map(JSON.parse(hashTable));
  }

  async refreshCache(cache: StudioServiceOutput): Promise<void> {
    const hashTable = await this.getCaches();

    const origin = hashTable.get(cache.tableId);

    const result = {
      ...origin,
      ...Object.fromEntries(
        Object.entries(cache).filter(([_key, v]) => _key !== undefined && v !== undefined),
      ),
    } as StudioServiceOutput;

    hashTable.set(cache.tableId, result);

    return await this.cacheService.set('studio', JSON.stringify([...hashTable]), 86_400);
  }

  async onInit(): Promise<void> {}
}
