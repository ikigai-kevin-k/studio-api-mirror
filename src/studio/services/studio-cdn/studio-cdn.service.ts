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
    const output = await this.studioCacheService.getCache('cdn', type.tableId);
    if (!output) {
      throw new StudioNotFoundError(`table ${type.tableId} not found`);
    }
    return output as GetTableCdnOutput;
  }

  async insertTableCdn(type: InsertStudioTableCdnRequestType): Promise<InsertTableCdnOutput> {
    const studio: StudioCdn = new StudioCdn();
    studio.tableId = type.tableId;
    studio.cdnDst = type.cdnDst;

    const studioReturning = await this.studioCdnRepository.insertTableCdn(studio);
    const output = {
      tableId: studioReturning.TABLE_ID,
      cdnDst: studioReturning.CDN,
    };

    await this.studioCacheService.refreshCache('cdn', output);

    return output;
  }

  async updateTableCdn(type: UpdateStudioTableCdnRequestType): Promise<UpdateTableCdnOutput> {
    const entity: UpdateTableCdnEntity = {
      tableId: type.tableId,
      cdnDst: type.cdnDst,
    };

    const result = await this.studioCdnRepository.updateTableCdn(entity);
    if (result <= 0) throw new StudioNotFoundError(`tableId ${type.tableId} can't be found`);

    const output = {
      tableId: type.tableId,
      cdnDst: type.cdnDst,
    };

    await this.studioCacheService.refreshCache('cdn', output);

    return output;
  }

  async onInit(): Promise<void> {}
}
