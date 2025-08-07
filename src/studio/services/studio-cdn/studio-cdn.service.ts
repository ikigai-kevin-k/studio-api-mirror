import { LoggerService } from '@ikigaians/logger';
import {
  GetStudioTableCdnRequestType,
  UpsertStudioTableCdnRequestType,
} from 'src/studio/controller/v1/studio-cdn/studio-cdn.type';
import { StudioCdn } from 'src/studio/entities/studio-cdn.entity';
import { StudioNotFoundError } from 'src/studio/errors/studio-not-found.error';
import { StudioCdnRepository } from 'src/studio/repositories/studio-cdn/studio-cdn.repository';
import { EmptyStudioCacheResult } from 'src/studio/services/studio-cache/studio-cache.service.type';
import {
  GetTableCdnOutput,
  UpdateTableCdnOutput,
} from 'src/studio/services/studio-cdn/studio-cdn.service.type';
import { StudioCacheService } from '../studio-cache/studio-cache.service';

import { isFieldsEqual } from 'src/studio/utilities/cache.utility';

export class StudioCdnService {
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
    const studioMap = await this.studioCacheService.getCaches();
    const entity = studioMap.get(type.tableId);
    if (!entity) {
      throw new StudioNotFoundError(`table ${type.tableId} not found`);
    }

    return {
      tableId: type.tableId,
      cdnDst: entity.cdnDst,
    };
  }

  async upsertTableCdn(type: UpsertStudioTableCdnRequestType): Promise<UpdateTableCdnOutput> {
    const studioMap = await this.studioCacheService.getCaches();
    const data = studioMap.get(type.tableId) ?? EmptyStudioCacheResult();

    if (isFieldsEqual(type, data)) {
      return type;
    }

    const studio: StudioCdn = new StudioCdn();
    studio.tableId = type.tableId;
    studio.cdnDst = type.cdnDst;

    const studioReturning = await this.studioCdnRepository.upsertTableCdn(studio);

    data.tableId = studioReturning.TABLE_ID;
    data.cdnDst = studioReturning.CDN;

    await this.studioCacheService.refreshCache(data);

    return {
      tableId: data.tableId,
      cdnDst: data.cdnDst,
    };
  }
}
