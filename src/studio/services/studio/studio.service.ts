import { LoggerService } from '@ikigaians/logger';
import {
  GetStudioTableRequestType,
  UpsertStudioTableRequestType,
} from 'src/studio/controller/v1/studio/studio.type';
import { StudioNotFoundError } from 'src/studio/errors/studio-not-found.error';
import { EmptyStudioCacheResult } from 'src/studio/services/studio-cache/studio-cache.service.type';
import {
  GetStudioTableOutput,
  GetStudioTableResult,
  StudioTableResult,
  UpdateStudioTableResult,
} from 'src/studio/services/studio/studio.service.type';
import { Studio } from '../../entities/studio.entity';
import { StudioRepository } from '../../repositories/studio/studio.repository';
import { StudioCacheService } from '../studio-cache/studio-cache.service';

export class StudioService {
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
    const studioMap = await this.studioCacheService.getCaches();

    const studioReturning: StudioTableResult[] = [];

    for (const tableId of type.tableId ?? []) {
      const data = studioMap.get(tableId);
      if (data) {
        studioReturning.push(data);
      }
    }

    return {
      list: studioReturning.map((e) => {
        const output: GetStudioTableOutput = {
          tableId: e.tableId,
          tableStatus: e.tableStatus,
        };
        return output;
      }),
    };
  }

  async upsertStudioTable(type: UpsertStudioTableRequestType): Promise<UpdateStudioTableResult> {
    const studio: Studio = new Studio();
    studio.tableId = type.tableId;
    studio.tableStatus = type.tableStatus;

    const studioReturning = await this.studioRepository.upsertStudio(studio);

    const studioMap = await this.studioCacheService.getCaches();
    const data = studioMap.get(type.tableId) ?? EmptyStudioCacheResult();

    data.tableId = studioReturning.TABLE_ID;
    data.tableStatus = studioReturning.TABLE_STATUS;

    await this.studioCacheService.refreshCache(data);

    return {
      tableId: data.tableId,
      tableStatus: data.tableStatus,
    };
  }
}
