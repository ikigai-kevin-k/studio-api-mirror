import { LoggerService } from '@ikigaians/logger';
import { ModuleLifecycle } from '@ikigaians/mod';
import {
  GetStudioTableCdnRequestType,
  InsertStudioTableCdnRequestType,
  UpdateStudioTableCdnRequestType,
} from 'src/studio/controller/v1/studio-cdn/studio-cdn.type';
import { StudioCdn } from 'src/studio/entities/studio-cdn.entity';
import { StudioNotFoundError } from 'src/studio/errors/studio-not-found.error';
import { StudioCdnRepository } from 'src/studio/repositories/studio-cdn/studio-cdn.repository';
import { UpdateTableCdnEntity } from 'src/studio/repositories/studio-cdn/studio-cdn.repository.type';
import {
  GetTableCdnOutput,
  InsertTableCdnOutput,
  UpdateTableCdnOutput,
} from 'src/studio/services/studio-cdn/studio-cdn.service.type';
import { StudioCacheService } from '../studio-cache/studio-cache.service';

export class StudioCdnService implements ModuleLifecycle {
  constructor(
    private readonly studioCdnRepository: StudioCdnRepository,
    private readonly studioCacheService: StudioCacheService,
    private readonly logger: LoggerService,
  ) {}

  async getTableCdnByTableID(tableId: string): Promise<StudioCdn> {
    const entity = await this.studioCdnRepository.getTableCdnByTableID(tableId);

    if (!entity) {
      throw new StudioNotFoundError(`table ${tableId} not found`);
    }
    return entity;
  }

  async getTableCdn(type: GetStudioTableCdnRequestType): Promise<GetTableCdnOutput> {
    const entity = await this.studioCacheService.getCache(type.tableId);
    return {
      tableId: type.tableId,
      cdnDst: entity.cdnDst,
    };
  }

  async insertTableCdn(type: InsertStudioTableCdnRequestType): Promise<InsertTableCdnOutput> {
    const studio: StudioCdn = new StudioCdn();
    studio.tableId = type.tableId;
    studio.cdnDst = type.cdnDst;

    const studioReturning = await this.studioCdnRepository.insertTableCdn(studio);

    const data = await this.studioCacheService.getCache(type.tableId);
    data.tableId = studioReturning.TABLE_ID;
    data.cdnDst = studioReturning.CDN;

    await this.studioCacheService.refreshCache(data);

    return {
      tableId: data.tableId,
      cdnDst: data.cdnDst,
    };
  }

  async updateTableCdn(type: UpdateStudioTableCdnRequestType): Promise<UpdateTableCdnOutput> {
    const entity: UpdateTableCdnEntity = {
      tableId: type.tableId,
      cdnDst: type.cdnDst,
    };

    const result = await this.studioCdnRepository.updateTableCdn(entity);
    if (result <= 0) throw new StudioNotFoundError(`tableId ${type.tableId} can't be found`);

    const data = await this.studioCacheService.getCache(type.tableId);
    data.tableId = type.tableId;
    data.cdnDst = type.cdnDst;

    await this.studioCacheService.refreshCache(data);

    return {
      tableId: data.tableId,
      cdnDst: data.cdnDst,
    };
  }

  async onInit(): Promise<void> {}
}
