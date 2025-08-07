import { CacheService } from '@ikigaians/cache';
import { LoggerService } from '@ikigaians/logger';
import { ModuleLifecycle } from '@ikigaians/mod';
import { StudioCacheRepository } from 'src/studio/repositories/studio-cache/studio-cache.repository';
import { StudioCacheResult } from 'src/studio/services/studio-cache/studio-cache.service.type';

export class StudioCacheService implements ModuleLifecycle {
  constructor(
    private readonly studioCacheRepository: StudioCacheRepository,
    private readonly cacheService: CacheService,
    private readonly logger: LoggerService,
  ) {}

  async getCaches(): Promise<Map<string, StudioCacheResult>> {
    const cacheStudios = await this.cacheService.get('studioMap');

    if (!cacheStudios) {
      const caches = await this.studioCacheRepository.getCaches();

      const studioMap = new Map();
      for (const cache of caches) {
        studioMap.set(cache.tableId, cache);
      }

      await this.cacheService.set('studioMap', JSON.stringify([...studioMap]), 86_400);

      return studioMap;
    }

    return new Map(JSON.parse(cacheStudios));
  }

  async refreshCache(cache: StudioCacheResult): Promise<void> {
    const studioMap = await this.getCaches();

    studioMap.set(cache.tableId, cache);

    return await this.cacheService.set('studioMap', JSON.stringify([...studioMap]), 86_400);
  }

  async onInit(): Promise<void> {}
}
