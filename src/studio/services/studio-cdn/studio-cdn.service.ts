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
  GetTableCdnOutput,
  InsertTableCdnOutput,
  UpdateTableCdnOutput,
} from 'src/studio/services/studio-cdn/studio-cdn.service.type';

export class StudioCdnService implements ModuleLifecycle {
  constructor(
    private readonly studioCdnRepository: StudioCdnRepository,
    private readonly cacheService: CacheService,
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
    const output = await this.getCache(type.tableId);
    if (!output) {
      throw new StudioNotFoundError(`table ${type.tableId} not found`);
    }
    return output;
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

    await this.refreshCache(output);

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

    await this.refreshCache(output);

    return output;
  }

  async getCaches(): Promise<Map<string, GetTableCdnOutput>> {
    const tag = 'cdn';
    const hashTable = await this.cacheService.get(tag);

    if (!hashTable) {
      const caches = await this.studioCdnRepository.getStudioCdnCache();

      const cacheMap = new Map();
      for (const cache of caches) {
        cacheMap.set(cache.tableId, cache);
      }

      await this.cacheService.set(tag, JSON.stringify([...cacheMap]), 86_400);

      return cacheMap;
    }

    return new Map(JSON.parse(hashTable));
  }

  async getCache(key: string): Promise<GetTableCdnOutput | undefined> {
    const hashTable = await this.getCaches();
    return hashTable.get(key);
  }

  async refreshCache(cache: GetTableCdnOutput): Promise<void> {
    const hashTable = await this.getCaches();

    const origin = hashTable.get(cache.tableId);

    const result = {
      ...origin,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ...Object.fromEntries(Object.entries(cache).filter(([_, v]) => v !== undefined)),
    } as GetTableCdnOutput;

    hashTable.set(cache.tableId, result);

    return await this.cacheService.set('cdn', JSON.stringify([...hashTable]), 86_400);
  }

  async onInit(): Promise<void> {}
}
