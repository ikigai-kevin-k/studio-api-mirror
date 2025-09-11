import { LoggerService } from '@ikigaians/logger';
import { ModuleLifecycle } from '@ikigaians/mod';
import { CacheService } from 'src/cache/cache.service';
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
  GetStudioCdnServiceOutput,
  InsertStudioCdnServiceOutput,
  UpdateStudioCdnServiceOutput,
} from 'src/studio/services/studio-cdn/studio-cdn.service.type';

export class StudioCdnService implements ModuleLifecycle {
  constructor(
    private readonly studioCdnRepository: StudioCdnRepository,
    private readonly cacheService: CacheService,
    private readonly logger: LoggerService,
  ) {}

  async getTableCdn(type: GetStudioTableCdnRequestType): Promise<GetStudioCdnServiceOutput> {
    const output = await this.getCache(type.tableId);
    if (!output) {
      throw new StudioNotFoundError(`table ${type.tableId} not found`);
    }
    return output;
  }

  async insertTableCdn(
    type: InsertStudioTableCdnRequestType,
  ): Promise<InsertStudioCdnServiceOutput> {
    const studio: StudioCdn = new StudioCdn();
    studio.tableId = type.tableId;
    studio.cdnDst = type.cdnDst;

    const studioReturning = await this.studioCdnRepository.insertTableCdn(studio);
    const output = {
      tableId: studioReturning.TABLE_ID,
      cdnDst: studioReturning.CDN,
    };

    await this.refreshCache(output);

    return output;
  }

  async updateTableCdn(
    type: UpdateStudioTableCdnRequestType,
  ): Promise<UpdateStudioCdnServiceOutput> {
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

    await this.refreshCache(output);

    return output;
  }

  async getCache(key: string): Promise<GetStudioCdnServiceOutput | undefined> {
    const tag = `studio-cdn-${key}`;
    const raw = await this.cacheService.get(tag);
    if (!raw) {
      const output = await this.studioCdnRepository.getTableCdnByTableID(key);
      if (output) await this.cacheService.set(tag, JSON.stringify(output), 86_400);
      return output;
    }
    return JSON.parse(raw) as GetStudioCdnServiceOutput;
  }

  async refreshCache(cache: GetStudioCdnServiceOutput): Promise<void> {
    const origin = await this.getCache(cache.tableId);

    const result = {
      ...origin,
      ...Object.fromEntries(
        Object.entries(cache).filter(([_key, v]) => _key !== undefined && v !== undefined),
      ),
    } as GetStudioCdnServiceOutput;

    return await this.cacheService.set(
      `studio-cdn-${cache.tableId}`,
      JSON.stringify(result),
      86_400,
    );
  }

  async onInit(): Promise<void> {}
}
