import { RedisService } from '@ikigaians/cache';
import { LoggerService } from '@ikigaians/logger';
import { ModuleLifecycle } from '@ikigaians/mod';
import { AppConfigService } from 'src/config';
export class CacheService extends RedisService implements ModuleLifecycle {
  constructor(
    logger: LoggerService,
    private readonly appConfigService: AppConfigService,
  ) {
    super(logger);
  }
  async onInit(): Promise<void> {
    console.log(JSON.stringify(this.appConfigService.cacheConfig));
    await this.connect(this.appConfigService.cacheConfig);
  }

  async onDispose(): Promise<void> {
    await this.disconnect();
  }
}
