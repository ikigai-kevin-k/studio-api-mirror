import { LoggerService } from '@ikigaians/logger';
import {
  GetStudioTableCdnRequestType,
  UpsertStudioTableCdnRequestType,
} from 'src/studio/controller/v1/studio-cdn/studio-cdn.type';
import { StudioCdn } from 'src/studio/entities/studio-cdn.entity';
import { StudioNotFoundError } from 'src/studio/errors/studio-not-found.error';
import { EmptyStudioCacheResult } from 'src/studio/model/studio-cache/studio-cache.model';
import {
  GetTableCdnOutput,
  UpdateTableCdnOutput,
} from 'src/studio/model/studio-cdn/studio-cdn.model';
import { StudioCdnRepository } from 'src/studio/repositories/studio-cdn/studio-cdn.repository';
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
      primary: {
        lo: entity.primaryLo,
        me: entity.primaryMe,
        hi: entity.primaryHi,
        hd: entity.primaryHd,
      },
      secondary: {
        lo: entity.secondaryLo,
        me: entity.secondaryMe,
        hi: entity.secondaryHi,
        hd: entity.secondaryHd,
      },
    };
  }

  async upsertTableCdn(type: UpsertStudioTableCdnRequestType): Promise<UpdateTableCdnOutput> {
    const studioMap = await this.studioCacheService.getCaches();
    const data = studioMap.get(type.tableId) ?? EmptyStudioCacheResult();

    const input = {
      tableId: type.tableId,
      primaryHd: type.primary.hd,
      primaryHi: type.primary.hi,
      primaryMe: type.primary.me,
      primaryLo: type.primary.lo,
      secondaryHd: type.secondary.hd,
      secondaryHi: type.secondary.hi,
      secondaryMe: type.secondary.me,
      secondaryLo: type.secondary.lo,
    };

    if (isFieldsEqual(input, data)) {
      return {
        tableId: input.tableId,
        primary: {
          hd: input.primaryHd,
          hi: input.primaryHi,
          me: input.primaryMe,
          lo: input.primaryLo,
        },
        secondary: {
          hd: input.secondaryHd,
          hi: input.secondaryHi,
          me: input.secondaryMe,
          lo: input.secondaryLo,
        },
      };
    }

    const studio: StudioCdn = new StudioCdn();
    studio.tableId = type.tableId;
    studio.primaryHd = type.primary.hd;
    studio.primaryHi = type.primary.hi;
    studio.primaryMe = type.primary.me;
    studio.primaryLo = type.primary.lo;
    studio.secondaryHd = type.secondary.hd;
    studio.secondaryHi = type.secondary.hi;
    studio.secondaryMe = type.secondary.me;
    studio.secondaryLo = type.secondary.lo;

    const studioReturning = await this.studioCdnRepository.upsertTableCdn(studio);

    data.tableId = studioReturning.TABLE_ID;
    data.primaryHd = studioReturning.PRIMARY_HD;
    data.primaryHi = studioReturning.PRIMARY_HI;
    data.primaryMe = studioReturning.PRIMARY_ME;
    data.primaryLo = studioReturning.PRIMARY_LO;
    data.secondaryHd = studioReturning.SECONDARY_HD;
    data.secondaryHi = studioReturning.SECONDARY_HI;
    data.secondaryMe = studioReturning.SECONDARY_ME;
    data.secondaryLo = studioReturning.SECONDARY_LO;

    await this.studioCacheService.refreshCache(data);

    return {
      tableId: data.tableId,
      primary: {
        hd: data.primaryHd,
        hi: data.primaryHi,
        me: data.primaryMe,
        lo: data.primaryLo,
      },
      secondary: {
        hd: data.secondaryHd,
        hi: data.secondaryHi,
        me: data.secondaryMe,
        lo: data.secondaryLo,
      },
    };
  }
}
