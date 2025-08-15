/* eslint-disable @typescript-eslint/no-unused-vars */
import { CacheService } from '@ikigaians/cache';
import { LoggerService } from '@ikigaians/logger';
import { ModuleLifecycle } from '@ikigaians/mod';
import { StudioCacheRepository } from 'src/studio/repositories/studio-cache/studio-cache.repository';
import { StudioCacheData } from 'src/studio/services/studio-cache/studio-cache.service.type';

export class StudioCacheService implements ModuleLifecycle {
  constructor(
    private readonly studioCacheRepository: StudioCacheRepository,
    private readonly cacheService: CacheService,
    private readonly logger: LoggerService,
  ) {}

  async queryCache(tag: string): Promise<StudioCacheData[]> {
    switch (tag) {
      case 'studio': {
        return await this.studioCacheRepository.getStudioCache();
      }
      case 'cdn': {
        return await this.studioCacheRepository.getStudioCdnCache();
      }
      case 'status': {
        return await this.studioCacheRepository.getStudioStatusCache();
      }
      default: {
        return [];
      }
    }
  }

  async getCaches(tag: string): Promise<Map<string, StudioCacheData>> {
    const hashTable = await this.cacheService.get(tag);

    if (!hashTable) {
      const caches = await this.queryCache(tag);

      const cacheMap = new Map();
      for (const cache of caches) {
        cacheMap.set(cache.tableId, cache);
      }

      await this.cacheService.set(tag, JSON.stringify([...cacheMap]), 86_400);

      return cacheMap;
    }

    return new Map(JSON.parse(hashTable));
  }

  async getCache(tag: string, key: string): Promise<StudioCacheData | undefined> {
    const hashTable = await this.getCaches(tag);
    return hashTable.get(key);
  }

  async refreshCache(tag: string, cache: StudioCacheData): Promise<void> {
    const hashTable = await this.getCaches(tag);

    const origin = hashTable.get(cache.tableId);

    const result = {
      ...origin,
      ...Object.fromEntries(Object.entries(cache).filter(([_, v]) => v !== undefined)),
    } as StudioCacheData;

    hashTable.set(cache.tableId, result);

    return await this.cacheService.set(tag, JSON.stringify([...hashTable]), 86_400);
  }

  async onInit(): Promise<void> {}
}
