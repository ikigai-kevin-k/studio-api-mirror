import { LoggerService } from '@ikigaians/logger';
import { ModuleLifecycle } from '@ikigaians/mod';
import {
  GetStudioTableRequestType,
  InsertStudioTableRequestType,
  UpdateStudioTableStatusRequestType,
} from 'src/studio/controller/v1/studio/studio.type';
import { StudioNotFoundError } from 'src/studio/errors/studio-not-found.error';
import { UpdateStudioTableStatusEntity } from 'src/studio/repositories/studio/studio.repository.type';
import {
  GetStudioTableOutput,
  GetStudioTableResult,
  InsertStudioTableResult,
  UpdateStudioTableStatusResult,
} from 'src/studio/services/studio/studio.service.type';
import { Studio } from '../../entities/studio.entity';
import { StudioRepository } from '../../repositories/studio/studio.repository';
import { StudioCacheService } from '../studio-cache/studio-cache.service';

export class StudioService implements ModuleLifecycle {
  constructor(
    private readonly studioRepository: StudioRepository,
    private readonly studioCacheService: StudioCacheService,
    private readonly logger: LoggerService,
  ) {}

  async getStudioTableByTableID(tableId: string): Promise<Studio> {
    const entity = await this.studioRepository.getStudioTableByTableID(tableId);

    if (!entity) {
      throw new StudioNotFoundError(`table ${tableId} not found`);
    }
    return entity;
  }

  async getStudioTable(type: GetStudioTableRequestType): Promise<GetStudioTableResult> {
    const cacheMap = await this.studioCacheService.getCaches('studio');

    const studioReturning: GetStudioTableOutput[] = [];

    for (const tableId of type.tableId ?? []) {
      const data = cacheMap.get(tableId);
      if (data) {
        studioReturning.push(data as GetStudioTableOutput);
      }
    }

    return {
      list: studioReturning,
    };
  }

  async insertStudioTable(type: InsertStudioTableRequestType): Promise<InsertStudioTableResult> {
    const studio: Studio = new Studio();
    studio.tableId = type.tableId;
    studio.tableStatus = type.tableStatus;

    const studioReturning = await this.studioRepository.insertStudioTable(studio);

    const output = {
      tableId: studioReturning.TABLE_ID,
      tableStatus: studioReturning.TABLE_STATUS,
    };

    await this.studioCacheService.refreshCache('studio', output);

    return output;
  }

  async updateStudioTableStatus(
    type: UpdateStudioTableStatusRequestType,
  ): Promise<UpdateStudioTableStatusResult> {
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

    await this.studioCacheService.refreshCache('studio', output);

    return output;
  }

  async onInit(): Promise<void> {}
}
