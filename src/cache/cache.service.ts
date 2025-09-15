import { RedisService } from '@ikigaians/cache';
import { LoggerService } from '@ikigaians/logger';
import { ModuleLifecycle } from '@ikigaians/mod';
import { reverseParsers, Schema } from 'src/cache/cache.service.type';
import { AppConfigService } from 'src/config';
export class CacheService extends RedisService implements ModuleLifecycle {
  constructor(
    logger: LoggerService,
    private readonly appConfigService: AppConfigService,
  ) {
    super(logger);
  }
  async onInit(): Promise<void> {
    await this.connect(this.appConfigService.cacheConfig);
  }

  async onDispose(): Promise<void> {
    await this.disconnect();
  }

  async getHashAs<T>(key: string, schema: Schema<T>): Promise<T | undefined> {
    const hash = await this.hGetAll(key);
    const output = {} as T;

    for (const key of Object.keys(schema) as (keyof T)[]) {
      const rawValue = hash[key as string];
      if (rawValue === undefined) return;

      const type = schema[key];
      const parser = reverseParsers[type];
      output[key] = parser(rawValue) as T[typeof key];
    }
    return output;
  }

  async setHash(key: string, cache: object, ttl: number = 86_400): Promise<void> {
    const data = new Map(
      Object.entries(cache)
        .filter((data) => data[1] !== undefined)
        .map(([k, v]) => {
          if (v instanceof Date) return [k, v.getTime().toString()];
          if (typeof v === 'object') return [k, JSON.stringify(v)];
          return [k, v.toString()];
        }),
    );

    if (data.size > 0) {
      await this.hSet(key, data);
      await this.expire(key, ttl);
    }
  }

  async refresh(key: string, cache: object, ttl: number = 86_400): Promise<void> {
    const isExist = await this.has(key);
    if (!isExist) return;

    return await this.setHash(key, cache, ttl);
  }
}
